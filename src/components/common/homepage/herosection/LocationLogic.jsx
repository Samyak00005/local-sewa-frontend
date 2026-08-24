import LocationPicker from "../../LocationPicker";

function LocationLogic({ children }) {
  return (
    <>
      <LocationPicker variant="hero" className="mb-5 max-w-[min(88vw,330px)] rounded-full backdrop-blur-md" />
      {children}
    </>
  );
}

export default LocationLogic;
