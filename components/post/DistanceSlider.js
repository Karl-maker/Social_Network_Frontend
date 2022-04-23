import Slider from "@mui/material/Slider";

export default function DistanceSlider({ setMaxDistance, maxDistance }) {
  const handleSliderChange = (event, newValue) => {
    setMaxDistance(newValue * 1000);
  };

  return (
    <>
      <Slider
        size="small"
        defaultValue={50}
        aria-label="Small"
        valueLabelDisplay="auto"
        style={{ width: "100%" }}
        onChange={handleSliderChange}
      />
    </>
  );
}
