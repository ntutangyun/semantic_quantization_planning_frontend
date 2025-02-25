import {useState} from "react";
import {SUPPORTED_CPU_LIST, SUPPORTED_GPU_LIST} from "@/app/utils";

export default function ClientInterface({clientConfig, setClientConfig}) {
    const [clientSelection, setClientSelection] = useState(0);

    const handleSelectChange = (event) => {
        setClientSelection(event.target.value);
    };

    const handleHardwareChange = (event) => {
        const {name, value} = event.target;
        setClientConfig((prevConfig) => {
            const updatedClients = [...prevConfig.clients];
            updatedClients[clientSelection - 1].hardware[name] = value;
            return {...prevConfig, clients: updatedClients};
        });
    };

    const handleSensitivityChange = (event, sensitivityType) => {
        const {value} = event.target;
        setClientConfig((prevConfig) => {
            const updatedClients = [...prevConfig.clients];
            updatedClients[clientSelection - 1].user_sensitivity[sensitivityType] = value;
            return {...prevConfig, clients: updatedClients};
        });
    };

    const clientAvailable = clientConfig && clientConfig["clients"].length > 0;

    return <div className={"p-10"}>

        <div className={"flex flex-row gap-3 items-center mb-5"}>
            <h1 className={"text-2xl "}>Step 3: Client Interface</h1>
            <select
                className="select select-bordered w-full max-w-xs"
                value={clientSelection}
                onChange={handleSelectChange}
                disabled={!clientAvailable}>
                <option disabled={clientAvailable} value={0}>
                    {clientAvailable ? "Select a client" : "No clients available"}
                </option>
                {clientAvailable && clientConfig.clients.map((client, index) => (
                    <option key={index + 1} value={index + 1}>
                        Client {index + 1}
                    </option>
                ))}
            </select>
        </div>

        {clientSelection > 0 && clientAvailable && clientConfig["clients"].length >= clientSelection && (
            <div>
                <div className={"grid grid-cols-3 gap-3"}>
                    <div className={"flex flex-col gap-2"}>
                        <h2 className={"text-xl"}>Hardware Configuration</h2>
                        <p>(note that the hardware options are DeepSeek-generated dummy list)</p>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">CPU</span>
                            </label>
                            <select
                                name="cpu"
                                className="select select-bordered"
                                value={clientConfig.clients[clientSelection - 1].hardware.cpu}
                                onChange={handleHardwareChange}>
                                {SUPPORTED_CPU_LIST.map((cpu, index) => (
                                    <option key={index} value={cpu}>
                                        {cpu}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">GPU</span>
                            </label>
                            <select
                                name="gpu"
                                className="select select-bordered"
                                value={clientConfig.clients[clientSelection - 1].hardware.gpu}
                                onChange={handleHardwareChange}
                            >
                                {SUPPORTED_GPU_LIST.map((gpu, index) => (
                                    <option key={index} value={gpu}>
                                        {gpu}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span
                                    className="label-text">RAM ({clientConfig.clients[clientSelection - 1].hardware.ram} GB)</span>
                            </label>
                            <input
                                type="range"
                                name="ram"
                                className="range"
                                min="1"
                                max="64"
                                value={clientConfig.clients[clientSelection - 1].hardware.ram}
                                onChange={handleHardwareChange}
                            />
                            <div className="flex justify-between text-xs px-2">
                                <span>1GB</span>
                                <span>64GB</span>
                            </div>
                        </div>
                    </div>

                    <div className={"flex flex-col gap-3"}>
                        <h2 className={"text-xl"}>User Sensitivity</h2>
                        <div className="form-control">
                            <label className="label">
                                <span
                                    className="label-text">Energy Sensitivity ({clientConfig.clients[clientSelection - 1].user_sensitivity.energy})</span>
                            </label>
                            <input
                                type="range"
                                name="energy"
                                className="range"
                                min="1"
                                max="10"
                                value={clientConfig.clients[clientSelection - 1].user_sensitivity.energy}
                                onChange={(event) => handleSensitivityChange(event, 'energy')}
                            />
                            <div className="flex justify-between text-xs px-2">
                                <span>1</span>
                                <span>10</span>
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span
                                    className="label-text">Latency Sensitivity ({clientConfig.clients[clientSelection - 1].user_sensitivity.latency})</span>
                            </label>
                            <input
                                type="range"
                                name="latency"
                                className="range"
                                min="1"
                                max="10"
                                value={clientConfig.clients[clientSelection - 1].user_sensitivity.latency}
                                onChange={(event) => handleSensitivityChange(event, 'latency')}
                            />
                            <div className="flex justify-between text-xs px-2">
                                <span>1</span>
                                <span>10</span>
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span
                                    className="label-text">Accuracy Sensitivity ({clientConfig.clients[clientSelection - 1].user_sensitivity.accuracy})</span>
                            </label>
                            <input
                                type="range"
                                name="accuracy"
                                className="range"
                                min="1"
                                max="10"
                                value={clientConfig.clients[clientSelection - 1].user_sensitivity.accuracy}
                                onChange={(event) => handleSensitivityChange(event, 'accuracy')}
                            />
                            <div className="flex justify-between text-xs px-2">
                                <span>1</span>
                                <span>10</span>
                            </div>
                        </div>
                    </div>

                    <div><h2 className={"text-xl"}>Chat</h2></div>
                </div>
            </div>
        )
        }
    </div>
}