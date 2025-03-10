export function getDefaultClientData() {
    return {
        supported_quantization_levels: [
            {
                quantization_level: 4,
                energy_consumption_percentage: 0.03,
                lag_s: 0.5,
                accuracy_estimate: 0.73
            },
            {
                quantization_level: 8,
                energy_consumption_percentage: 0.07,
                lag_s: 1,
                accuracy_estimate: 0.85
            },
            {
                quantization_level: 16,
                energy_consumption_percentage: 0.48,
                lag_s: 2,
                accuracy_estimate: 0.88
            },
            {
                quantization_level: 32,
                energy_consumption_percentage: 1.0,
                lag_s: 4,
                accuracy_estimate: 0.90
            }
        ],
        context_quantization_contribution_evaluation: {
            4: "unknown",
            6: "unknown",
            8: "unknown",
            12: "unknown",
            16: "unknown",
            32: "unknown"
        },
        user_sensitivity: {
            energy_sensitivity: "unknown",
            latency_sensitivity: "unknown",
            accuracy_sensitivity: "unknown"
        },
        user_usage: {
            noise_level: "unknown",
            interaction_frequency: "unknown",
            interaction_types: "unknown",
        },
        user_chat_history: [],
    }
}


export function getRandomInt(min, max) {
    min = Math.ceil(min); // Round up the minimum to ensure it's an integer
    max = Math.floor(max); // Round down the maximum to ensure it's an integer
    return Math.floor(Math.random() * (max - min + 1)) + min;
}