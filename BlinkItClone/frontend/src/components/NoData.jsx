import noDataImage from "../assets/nothing here yet.webp";

function NoData() {
  return (
    <div className="flex flex-col items-center justify-center">
      <img src={noDataImage} alt="No data" className="w-36" />
      <p className="text-neutral-500">No data found</p>
    </div>
  );
}
export default NoData;
