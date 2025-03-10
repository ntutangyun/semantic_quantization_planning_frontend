import { useEffect, useState } from "react";
import { getRandomInt } from "./utils";

export default function FederationServerInterface({ clientsConfig, setClientsConfig }) {

    const [clientQuantizationTableData, setClientQuantizationTableData] = useState([]);
    
    useEffect(() => {
        const tableData = [];
        clientsConfig.clients.forEach((client, clientIndex) => {
    
            let user_energy_sensitivity_gain = 0;
            let user_latency_sensitivity_gain = 0;
            let user_accuracy_sensitivity_gain = 0;
            let user_noise_level_gain = 0;
            let user_interaction_frequency_gain = 0;
            let user_interaction_types_gain = 0;

            switch(client.user_sensitivity.energy_sensitivity) {
                case "low":
                    user_energy_sensitivity_gain = 0.1;
                    break;
                case "high":
                    user_energy_sensitivity_gain = 0.3;
                    break;
                default:
                    user_energy_sensitivity_gain = 0;
            }

            switch(client.user_sensitivity.latency_sensitivity) {
                case "low":
                    user_latency_sensitivity_gain = 0.1;
                    break;
                case "high":
                    user_latency_sensitivity_gain = 0.3;
                    break;
                default:
                    user_latency_sensitivity_gain = 0;
            }

            switch(client.user_sensitivity.accuracy_sensitivity) {
                case "low":
                    user_accuracy_sensitivity_gain = 0.1;
                    break;
                case "high":
                    user_accuracy_sensitivity_gain = 0.3;
                    break;
                default:
                    user_accuracy_sensitivity_gain = 0;
            }

            switch(client.user_usage.noise_level) {
                case "low":
                    user_noise_level_gain = 0.1;
                    break;
                case "high":
                    user_noise_level_gain = 0.3;
                    break;
                default:
                    user_noise_level_gain = 0;
            }

            switch(client.user_usage.interaction_frequency) {
                case "low":
                    user_interaction_frequency_gain = 0.1;
                    break;
                case "high":
                    user_interaction_frequency_gain = 0.3;
                    break;
                default:
                    user_interaction_frequency_gain = 0;
            }

            client.supported_quantization_levels.forEach((level) => {
                tableData.push({
                    clientId: "Client " + (clientIndex + 1),
                    quantizationLevel: level.quantization_level,
                    benefit: getRandomInt(1, 10),
                    cost: getRandomInt(1, 10),
                });
            });
        });

        setClientQuantizationTableData(tableData);
    }, [clientsConfig]);

    return <div className={"px-10"}>
        <div className="divider">Step 4: Federation Server Controls</div>
        <table className="table">
            {/* head */}
            <thead>
                <tr>
                    <th>Client ID</th>
                    <th>Quantization Level</th>
                    <th>Benefit</th>
                    <th>Cost</th>
                </tr>
            </thead>
            <tbody>
                {clientQuantizationTableData.map((row, index) => (
                    <tr key={index}>
                        <td>{row.clientId}</td>
                        <td>{row.quantizationLevel}</td>
                        <td>{row.benefit}</td>
                        <td>{row.cost}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}