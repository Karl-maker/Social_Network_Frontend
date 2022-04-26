import Slider from "@mui/material/Slider";
import { useContext } from "react";
import { AlertContext } from "../templates/ContextProvider";
import { MetersAndKilometers } from "../utils/distance";

export default function DistanceSlider({
  setMaxDistance,
  maxDistance,
  sideElement,
  additionalAction,
}) {
  const alertServices = useContext(AlertContext);
  const MINVALUE = 20;
  const MAXVALUE = 50000;

  const handleSliderChange = (event, newValue) => {
    if (newValue === MAXVALUE) {
      alertServices.setAlertInfo({
        severity: "info",
        content: `Maximum Distance of ${MetersAndKilometers(
          MAXVALUE
        )} for a further look`,
        title: "Reached The Max Distance",
      });
      alertServices.setAlert(true);
    } else if (newValue === MINVALUE) {
      alertServices.setAlertInfo({
        severity: "info",
        content: `Minimum Distance of ${MetersAndKilometers(
          MINVALUE
        )} for a closer look`,
        title: "Can't Get Smaller :/",
      });
      alertServices.setAlert(true);
    }
    setMaxDistance(newValue);
  };

  const marks = [
    {
      value: 20,
      label: "20m",
    },
    {
      value: 10000,
      label: "10km",
    },
    {
      value: 50000,
      label: "50km",
    },
  ];

  function valuetext(value) {
    return `${value}m`;
  }

  return (
    <div className="row">
      <div className="col-10">
        <Slider
          aria-label="Always visible"
          defaultValue={maxDistance}
          valueLabelFormat={valuetext}
          getAriaValueText={valuetext}
          step={10}
          min={MINVALUE}
          max={MAXVALUE}
          marks={marks}
          valueLabelDisplay="off"
          value={maxDistance}
          onChange={handleSliderChange}
          onChangeCommitted={additionalAction}
        />
      </div>
      <div className="col-2">{sideElement}</div>
    </div>
  );
}
