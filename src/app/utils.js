export function getDefaultClientData() {
    return {
        supported_quantization_levels: [
            {
                quantization_level: 4,
                energy_consumption_percentage: 0.4,
                lag_s: 0.5,
                accuracy_estimate: 0.8
            },
            {
                quantization_level: 8,
                energy_consumption_percentage: 0.6,
                lag_s: 1,
                accuracy_estimate: 0.85
            },
            {
                quantization_level: 16,
                energy_consumption_percentage: 0.8,
                lag_s: 2,
                accuracy_estimate: 0.9
            },
            {
                quantization_level: 32,
                energy_consumption_percentage: 1.0,
                lag_s: 4,
                accuracy_estimate: 0.95
            }
        ],
        user_threshold: {
            energy_threshold: 1.0,
            lag_threshold: 5,
            accuracy_threshold: 0.7
        },
        user_chat_history: [],
        user_contributions: {
            no_training_samples_per_day: 5,
            operation_context: "",
        },
    }
}
