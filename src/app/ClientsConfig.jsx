import {useState} from "react";
import {getDefaultClientData} from "@/app/utils";

export default function ClientsConfig({clientsConfig, setClientsConfig, currentClientIndex, setCurrentClientIndex}) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const onAddClient = () => {
        setClientsConfig((prevConfig) => ({
            ...prevConfig,
            clients: [...prevConfig.clients, getDefaultClientData()],
        }));
    };

    const onReset = () => {
        setClientsConfig({
            clients: [],
        });
        setShowConfirmModal(false);
    };

    const handleResetClick = () => {
        setShowConfirmModal(true);
    };

    const handleCancel = () => {
        setShowConfirmModal(false);
    };

    return (
        <div className={"p-10"}>
            <div className="divider">Step 2: Clients Configuration</div>

            <div className="flex flex-row gap-5 items-center">
                <p>Number of Clients: {clientsConfig["clients"].length}</p>
                <button className="btn btn-outline" onClick={onAddClient}>Add Client</button>
                <button className="btn btn-outline btn-error ml-auto" onClick={handleResetClick}>Reset</button>
            </div>

            {showConfirmModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm Reset</h3>
                        <p className="py-4">Are you sure you want to reset all client configurations?</p>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={onReset}>Confirm</button>
                            <button className="btn" onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={"flex flex-wrap gap-3 mt-5"}>
                {clientsConfig.clients.map((client, index) => (
                    <div
                        key={index}
                        className={`w-60 bg-base-100 cursor-pointer border rounded hover:border-white hover:font-bold ${currentClientIndex === index ? "border-white border-2 font-bold" : "border-gray-700"}`}
                        onClick={() => setCurrentClientIndex(index)}>
                        <h2 className="p-3 text-center">Client {index + 1}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}