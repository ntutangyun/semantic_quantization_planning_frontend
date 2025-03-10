import { useEffect, useState } from "react";

export default function ClientInterface({ currentClient, currentClientIndex, setClientsConfig }) {
    const [ws, setWs] = useState(null);
    const [chatInput, setChatInput] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");

    const onStartConversation = () => {
        if (ws) {
            ws.close();
        }

        // reset client chat history
        setClientsConfig((prevConfig) => {
            const updatedClients = JSON.parse(JSON.stringify(prevConfig.clients));
            updatedClients[currentClientIndex].user_chat_history = [];
            return { ...prevConfig, clients: updatedClients };
        });

        const newWs = new WebSocket("ws://localhost:8765");
        setWs(newWs);
    };

    useEffect(() => {
        if (ws) {
            ws.onopen = () => {
                setConnectionStatus("Connected");
            };
            ws.onclose = () => {
                setConnectionStatus("Disconnected");
            };
            ws.onerror = (e) => {
                setConnectionStatus("Error");
                alert(`Failed to establish websocket connection with the backend server:  ${e}`);
            };
            ws.onmessage = (event) => {
                console.log(event.data);
                const messageBody = JSON.parse(event.data);
                if (messageBody.type === "user-chat-request") {
                    console.log("received chat request from agent: ", messageBody.data.content);
                    setClientsConfig((prevConfig) => {
                        const updatedClients = JSON.parse(JSON.stringify(prevConfig.clients));
                        updatedClients[currentClientIndex].user_chat_history.push(messageBody.data);
                        return { ...prevConfig, clients: updatedClients };
                    });
                } else if (messageBody.type === "user-interview-summary") {
                    console.log("received user interview complete message: ", messageBody.data);

                    const interviewSummary = messageBody.data;

                    setClientsConfig((prevConfig) => {
                        const updatedClients = JSON.parse(JSON.stringify(prevConfig.clients));
                        updatedClients[currentClientIndex].user_chat_history.push({ "role": "assistant", "content": "User interview completed. Thank you for your input." });
                        updatedClients[currentClientIndex].user_chat_history.push({ "role": "assistant", "content": "Now I'm estimating the best configuration (the potential contribution for each quantization level) for you ..."});
                        updatedClients[currentClientIndex].user_usage.noise_level = interviewSummary.noise_level;
                        updatedClients[currentClientIndex].user_usage.interaction_frequency = interviewSummary.interaction_frequency;
                        updatedClients[currentClientIndex].user_usage.interaction_types = interviewSummary.interaction_types;
                        updatedClients[currentClientIndex].user_sensitivity.energy_sensitivity = interviewSummary.energy_sensitivity;
                        updatedClients[currentClientIndex].user_sensitivity.accuracy_sensitivity = interviewSummary.accuracy_sensitivity;
                        updatedClients[currentClientIndex].user_sensitivity.latency_sensitivity = interviewSummary.latency_sensitivity;
                        return { ...prevConfig, clients: updatedClients };
                    });
                } else if (messageBody.type === "context-quantization-evaluation-result") {
                    console.log("received quantization evaluation result: ", messageBody.data);

                    const evaluationResult = messageBody.data;
                    setClientsConfig((prevConfig) => {
                        const updatedClients = JSON.parse(JSON.stringify(prevConfig.clients));
                        const newClientConfig = updatedClients[currentClientIndex];
                        newClientConfig.user_chat_history.push({ "role": "assistant", "content": "Done! Your context is well understood. Thank you again for using the smart home hub. (The user is ready to participate the next round of federated learning when the appropriate qunatization level will be planned for the user)." });
                        newClientConfig.context_quantization_contribution_evaluation = evaluationResult;
                        return { ...prevConfig, clients: updatedClients };
                    });

                    ws.close();
                } else {
                    console.error("Unknown message type: ", messageBody.type);
                }
            }
        }
    }, [ws]);

    const handleSendMessage = () => {
        console.log("sending message: ", chatInput);
        if (currentClient && currentClient.user_chat_history.length === 0) {
            console.log("no assistant message, cannot send message");
            return;
        }
        if (currentClient.user_chat_history[currentClient.user_chat_history.length - 1].role !== "assistant") {
            console.log("the latest message is not from assistant, cannot send message");
            return;
        }
        if (ws && chatInput.trim() !== "") {
            const message = {
                type: "user-chat-response",
                data: {
                    // repeat the last assistant question
                    "pending_question": currentClient.user_chat_history[currentClient.user_chat_history.length - 1].content,
                    "content": chatInput,
                    "role": "user"
                }
            };
            ws.send(JSON.stringify(message));
            setClientsConfig((prevConfig) => {
                const updatedClients = JSON.parse(JSON.stringify(prevConfig.clients));
                updatedClients[currentClientIndex].user_chat_history.push(message.data);
                return { ...prevConfig, clients: updatedClients };
            });
            setChatInput("");
        }
    };

    const handleKeyUp = (event) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    const onClientConfigInputChange = (category, field, value) => {
        setClientsConfig((prevConfig) => {
            const updatedClients = JSON.parse(JSON.stringify(prevConfig.clients));
            updatedClients[currentClientIndex][category][field] = value;
            return { ...prevConfig, clients: updatedClients };
        });
    };

    const generateLevelRadioControls = (title, radioName, value, onChangeHandler) => {
        return (
            <div className="form-control flex flex-row gap-3 items-center">
                <div>{title}</div>
                <label className="label cursor-pointer">
                    <input type="radio" name={radioName} className="radio" value="unknown"
                        onChange={onChangeHandler}
                        checked={value === "unknown"} />
                    <span className="label-text mx-2">Unknown</span>
                </label>
                <label className="label cursor-pointer">
                    <input type="radio" name={radioName} className="radio" value="low"
                        onChange={onChangeHandler}
                        checked={value === "low"} />
                    <span className="label-text mx-2">Low</span>
                </label>
                <label className="label cursor-pointer">
                    <input type="radio" name={radioName} className="radio" value="high"
                        onChange={onChangeHandler}
                        checked={value === "high"} />
                    <span className="label-text mx-2">High</span>
                </label>
            </div>
        )
    }

    return <div className={"px-10"}>
        {currentClient && (
            <div>
                <div className={"flex flex-row gap-3"}>
                    <div className={"flex flex-col gap-2 flex-grow"}>
                        <h2 className={"text-xl"}>Supported Quantization Levels</h2>
                        <sub className={"mb-2"}>Note that the accuracy, energy and latency are estimated based on the
                            extracted hardware
                            setup.</sub>
                        {currentClient.supported_quantization_levels.map((level, index) => (
                            <div
                                className={`stats shadow w-full}`}
                                key={index}>
                                <div className="stat">
                                    <div className="stat-title">BIT</div>
                                    <div className="stat-value text-primary">{level.quantization_level}</div>
                                    <div className="stat-desc"></div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Accuracy</div>
                                    <div className="stat-value text-info">{level.accuracy_estimate}</div>
                                </div>

                                <div className="stat">
                                    <div className="stat-title">Energy Cost</div>
                                    <div
                                        className="stat-value text-secondary">{Math.round(level.energy_consumption_percentage * 100)} %
                                    </div>
                                </div>

                                <div className="stat">
                                    <div className="stat-title">Latency</div>
                                    <div className="stat-value">{level.lag_s} s</div>
                                </div>
                            </div>
                        ))}

                        <div className={"flex flex-col gap-2"}>
                            <h2 className={"text-xl"}>User Usage</h2>
                            {generateLevelRadioControls("Noise Level", "radio-noise-level",
                                currentClient.user_usage.noise_level, (e) => onClientConfigInputChange("user_usage", "noise_level", e.target.value))}
                            {generateLevelRadioControls("Interaction Frequency", "radio-interaction-frequency",
                                currentClient.user_usage.interaction_frequency, (e) => onClientConfigInputChange("user_usage", "interaction_frequency", e.target.value))}
                            <div className="form-control">
                                <div>Interaction Types</div>
                                <textarea className="textarea h-24 textarea-bordered"
                                    value={currentClient.user_usage.interaction_types}
                                    onChange={(e) => onClientConfigInputChange("user_usage", "interaction_types", e.target.value)}></textarea>
                            </div>
                        </div>

                        <div className={"flex flex-col gap-2"}>
                            <h2 className={"text-xl"}>User Preference</h2>
                            {generateLevelRadioControls("Energy Sensitivity", "radio-energy-sensitivity",
                                currentClient.user_sensitivity.energy_sensitivity, (e) => onClientConfigInputChange("user_sensitivity", "energy_sensitivity", e.target.value))}
                            {generateLevelRadioControls("Latency Sensitivity", "radio-latency-sensitivity",
                                currentClient.user_sensitivity.latency_sensitivity, (e) => onClientConfigInputChange("user_sensitivity", "latency_sensitivity", e.target.value))}
                            {generateLevelRadioControls("Accuracy Sensitivity", "radio-accuracy-sensitivity",
                                currentClient.user_sensitivity.accuracy_sensitivity, (e) => onClientConfigInputChange("user_sensitivity", "accuracy_sensitivity", e.target.value))}
                        </div>
                    </div>

                    <div className={"w-[60rem]"}>
                        <div className={"flex flex-row gap-3 items-center"}>
                            <h2 className={"text-xl"}>Chat</h2>
                            <button className={"btn btn-outline btn-sm"} onClick={onStartConversation}
                                disabled={connectionStatus === "Connected"}>Start Conversation
                            </button>
                            <span
                                className={`ml-2 ${connectionStatus === "Connected" ? "text-green-500" : connectionStatus === "Error" ? "text-red-500" : "text-gray-500"}`}>
                                {connectionStatus}
                            </span>
                        </div>

                        <div className={"h-[40rem]  bg-slate-950 my-2 overflow-y-auto"}>
                            {currentClient.user_chat_history.map((message, index) => {
                                if (message.role === "user") {
                                    return <div className="chat chat-end" key={index}>
                                        <div className="chat-bubble chat-bubble-primary">{message.content}</div>
                                    </div>
                                } else {
                                    return <div className="chat chat-start" key={index}>
                                        <div className="chat-bubble chat-bubble-neutral">{message.content}</div>
                                    </div>
                                }
                            })}
                        </div>

                        <div className={"flex flex-row gap-3 items-center"}>
                            <input type="text" className={"input input-bordered w-full"} value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyUp={handleKeyUp} />
                            <button className={"btn btn-outline"} onClick={handleSendMessage}>
                                Send
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        )
        }
    </div>
}