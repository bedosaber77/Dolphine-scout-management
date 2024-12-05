import EmblaCarousel from "../components/ui/EmblaCarousel";
import "../styles/base.css";
import "../styles/embla.css";

const IMAGES = [
  "https://plus.unsplash.com/premium_photo-1661893427047-16f6ddc173f6?q=80&w=500&h=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1541790453029-41ad91024de6?w=500&h=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8a2F5YWt8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1450500392544-c2cb0fd6e3b8?w=500&h=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8a2F5YWt8ZW58MHx8MHx8fDA%3D",
];

const OPTIONS = {
  direction: "rtl", // right to Left
};
const Event = () => {
  return (
    <>
      <EmblaCarousel slides={IMAGES} options={OPTIONS} />
    </>
  );
};

export default Event;
