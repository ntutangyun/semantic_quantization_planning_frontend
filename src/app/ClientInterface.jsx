import {useEffect, useState} from "react";

export default function ClientInterface({currentClient, currentClientIndex, setClientsConfig}) {
    const [ws, setWs] = useState(null);
    const [chatInput, setChatInput] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");

    const handleThresholdChange = (event) => {
        const {name, value} = event.target;
        const parsedValue = parseFloat(value);
        setClientsConfig((prevConfig) => {
            const updatedClients = JSON.parse(JSON.stringify(prevConfig.clients));
            updatedClients[currentClientIndex].user_threshold[name] = parsedValue;
            return {...prevConfig, clients: updatedClients};
        });
    };

    const onStartConversation = () => {
        if (ws) {
            ws.close();
        }
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
            ws.onerror = () => {
                setConnectionStatus("Error");
            };
            ws.onmessage = (event) => {
                console.log(event.data);
                const messageBody = JSON.parse(event.data);
                if (messageBody.type === "user-chat-request") {
                    console.log("received chat request from agent: ", messageBody.data.content);
                    setClientsConfig((prevConfig) => {
                        const updatedClients = JSON.parse(JSON.stringify(prevConfig.clients));
                        updatedClients[currentClientIndex].user_chat_history.push(messageBody.data);
                        return {...prevConfig, clients: updatedClients};
                    });
                } else if (messageBody.type === "user-interview-completed") {
                    console.log("received user interview complete message: ", messageBody.data.content);
                    setClientsConfig((prevConfig) => {
                        const updatedClients = JSON.parse(JSON.stringify(prevConfig.clients));
                        updatedClients[currentClientIndex].user_chat_history.push(messageBody.data);
                        return {...prevConfig, clients: updatedClients};
                    });
                    ws.close();
                } else {
                    console.error("Unknown message type: ", messageBody.type);
                }
            }
        }
    }, [ws]);

    const isQuantizationLevelUserThresholdFiltered = (level) => {
        const {accuracy_threshold, energy_threshold, lag_threshold} = currentClient.user_threshold;
        return (
            level.accuracy_estimate >= accuracy_threshold &&
            level.energy_consumption_percentage <= energy_threshold &&
            level.lag_s <= lag_threshold
        );
    };


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
                return {...prevConfig, clients: updatedClients};
            });
            setChatInput("");
        }
    };

    const handleKeyUp = (event) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    return <div className={"px-10"}>
        <div className="divider">Step 3: Client Interface</div>

        {currentClient && (
            <div>
                <div className={"grid grid-cols-3 gap-3"}>
                    <div className={"flex flex-col gap-2"}>
                        <h2 className={"text-xl"}>Supported Quantization Levels</h2>
                        <sub className={"mb-2"}>Note that the accuracy, energy and latency are estimated based on the
                            extracted hardware
                            setup.</sub>
                        {currentClient.supported_quantization_levels.map((level, index) => (
                            <div
                                className={`stats shadow w-full ${isQuantizationLevelUserThresholdFiltered(level) ? "bg-green-900" : ""}`}
                                key={index}>
                                <div className="stat">
                                    <div className="stat-title">Quantization</div>
                                    <div className="stat-value text-primary">{level.quantization_level} BIT</div>
                                    <div className="stat-desc"></div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Accuracy</div>
                                    <div className="stat-value text-info">{level.accuracy_estimate}</div>
                                </div>

                                <div className="stat">
                                    <div className="stat-title">Energy Cost</div>
                                    <div
                                        className="stat-value text-secondary">{level.energy_consumption_percentage * 100} %
                                    </div>
                                </div>

                                <div className="stat">
                                    <div className="stat-title">Latency</div>
                                    <div className="stat-value">{level.lag_s} s</div>
                                </div>
                            </div>
                        ))}

                        <div className={"flex flex-col gap-2"}>
                            <h2 className={"text-xl"}>User Threshold</h2>
                            <sub>Drag the slider to adjust the user thresholds. Satisfied
                                quantization levels will be
                                highlighted.</sub>
                            <div className="stats shadow w-full">
                                <div className="stat">
                                    <div className="stat-title">Accuracy</div>
                                    <input
                                        type="range"
                                        name="accuracy_threshold"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={currentClient.user_threshold.accuracy_threshold}
                                        onChange={handleThresholdChange}
                                        className="range range-info"
                                    />
                                    <div
                                        className="stat-value text-info">{currentClient.user_threshold.accuracy_threshold}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Energy</div>
                                    <input
                                        type="range"
                                        name="energy_threshold"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={currentClient.user_threshold.energy_threshold}
                                        onChange={handleThresholdChange}
                                        className="range range-secondary"
                                    />
                                    <div
                                        className="stat-value text-secondary">{currentClient.user_threshold.energy_threshold * 100} %
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Latency</div>
                                    <input
                                        type="range"
                                        name="lag_threshold"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        value={currentClient.user_threshold.lag_threshold}
                                        onChange={handleThresholdChange}
                                        className="range"
                                    />
                                    <div
                                        className="stat-value">{currentClient.user_threshold.lag_threshold} s
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className={"col-span-2"}>
                        <div className={"flex flex-row gap-3 items-center"}>
                            <h2 className={"text-xl"}>Chat</h2>
                            <button className={"btn btn-outline btn-sm"} onClick={onStartConversation}>Start
                                Conversation
                            </button>
                            <span
                                className={`ml-2 ${connectionStatus === "Connected" ? "text-green-500" : connectionStatus === "Error" ? "text-red-500" : "text-gray-500"}`}>
                                {connectionStatus}
                            </span>
                        </div>

                        <div className={"h-[40rem] bg-slate-950 my-2 overflow-y-auto"}>
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
                                   onKeyUp={handleKeyUp}/>
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