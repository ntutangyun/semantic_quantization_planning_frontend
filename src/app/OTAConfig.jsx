export default function OTAConfig({otaConfig, setOtaConfig}) {
    const handleCheckboxChange = (level) => {
        setOtaConfig((prevConfig) => ({
            ...prevConfig,
            supportedQuantizationLevels: {
                ...prevConfig.supportedQuantizationLevels,
                [level]: !prevConfig.supportedQuantizationLevels[level],
            },
        }));
    };

    return (
        <div className={"p-10"} id={"ota-config"}>
            <div className="divider">Step 1: Over-the-Air Aggregation Channel Configuration</div>

            <div className="flex flex-row gap-5 items-center">
                <p>Supported Quantization Levels</p>
                <div className={"flex flex-row gap-8 items-center"}>
                    {Object.keys(otaConfig.supportedQuantizationLevels).map((level) => (
                        <div className="form-control w-max" key={level}>
                            <label className="label cursor-pointer flex flex-row gap-2 items-center">
                                <span className="label-text">{level} BIT</span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={otaConfig.supportedQuantizationLevels[level]}
                                    onChange={() => handleCheckboxChange(level)}
                                />
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}