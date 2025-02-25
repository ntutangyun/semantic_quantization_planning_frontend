import {useState} from "react";
import {getDefaultClientData} from "@/app/utils";

export default function ClientConfig({clientConfig, setClientConfig}) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const onAddClient = () => {
        setClientConfig((prevConfig) => ({
            ...prevConfig,
            clients: [...prevConfig.clients, getDefaultClientData()],
        }));
    };

    const onReset = () => {
        setClientConfig({
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
            <h1 className={"text-2xl mb-5"}>Step 2: Client Configuration</h1>

            <div className="flex flex-row gap-5 items-center">
                <p>Number of Clients: {clientConfig["clients"].length}</p>
                <button className="btn btn-outline" onClick={onAddClient}>Add Client</button>
                <button className="btn btn-outline btn-error ml-10" onClick={handleResetClick}>Reset</button>
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
        </div>
    );
}