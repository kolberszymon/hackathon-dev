import { useEffect } from "react";

export default function Sidebar({ data }) {
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div
      className={`absolute top-0 bottom-0 right-0 bg-white z-50 ${
        data ? "sidebar" : "nosidebar"
      } flex flex-col justify-center items-center`}
    >
      <p className="font-bold mb-10">{data && data.name}</p>
      <p className="text-green-400">
        {data && data.isAvailableForSell && "Apartment is listed for sell!"}
      </p>
      <p className="font-bold mb-6">{data && data.price}</p>
      {data && (
        <button
          type="button"
          className="bg-green-400 px-3 py-2 text-white uppercase rounded-2xl shadow-md font-bold"
        >
          buy now
        </button>
      )}
    </div>
  );
}
