import { useParams } from "react-router-dom";

const StudentDetails = () => {
  const params = useParams();
  return (
    <div>
      <div className="bg-[#091F5B] h-36 flex justify-between items-center ">
        <div className="ml-6 flex gap-4 ">
          <img src="/images/student/profile.svg" />
          <div className="mt-10">
            <h1 className="font-bold text-xl text-white ">Shata</h1>
            <p className="font-bold text-xl text-white mt-2 ">
              Student Id: {params.id}
            </p>
          </div>
        </div>
        <div className="flex justify-end h-36">
          <div className="relative flex w-20 ">
            <img
              src="/images/student/profileBackground.svg"
              className="w-16 h-16 absolute right-[-111px]  bottom-[-20px] "
            />
          </div>
          <div className="relative flex w-20 ">
            <img
              src="/images/student/profileBackground.svg"
              className="w-16 h-16 absolute right-[-97px] top-[-12px] "
            />
          </div>
          <div className="relative flex w-20 ">
            <img
              src="/images/student/profileBackground.svg"
              className="w-16 h-16 absolute right-[133px] top-0"
            />
          </div>
        </div>
      </div>
      <div className="border rounded-md p-4 mt-4">
        <h1 className="font-bold text-xl ">Fees</h1>
        <div className="mt-4 flex flex-wrap items-center gap-10">
          <div className="bg-[#DBDBDB] flex flex-col justify-center items-center p-4 rounded-md">
            <h2 className="text-sm mb-1">Class</h2>
            <p className="text-2xl font-bold font-body">Class: 7</p>
          </div>
          <div className="bg-[#DBDBDB] flex flex-col justify-center items-center p-4 rounded-md">
            <h2 className="text-sm mb-1">Class</h2>
            <p className="text-2xl font-bold font-body">Class: 7</p>
          </div>
          <div className="bg-[#DBDBDB] flex flex-col justify-center items-center p-4 rounded-md">
            <h2 className="text-sm mb-1">Class</h2>
            <p className="text-2xl font-bold font-body">Class: 7</p>
          </div>
          <div className="bg-[#DBDBDB] flex flex-col justify-center items-center p-4 rounded-md">
            <h2 className="text-sm mb-1">Class</h2>
            <p className="text-2xl font-bold font-body">Class: 7</p>
          </div>
          <div className="bg-[#DBDBDB] flex flex-col justify-center items-center p-4 rounded-md">
            <h2 className="text-sm mb-1">Class</h2>
            <p className="text-2xl font-bold font-body">Class: 7</p>
          </div>
          <div className="bg-[#DBDBDB] flex flex-col justify-center items-center p-4 rounded-md">
            <h2 className="text-sm mb-1">Class</h2>
            <p className="text-2xl font-bold font-body">Class: 7</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center border rounded-md p-4">
        <h1 className="font-bold text-2xl my-4">Payment Method</h1>
        <div className="flex gap-10 mt-4">
          <div className="flex gap-3 items-center">
            <input type="radio" className="radio radio-primary" />
            <h2 className="font-bold text-4xl">Cash</h2>
          </div>
          <div className="flex gap-3 items-center">
            <input type="radio" className="radio radio-primary" />
            <h2 className="font-bold text-4xl">Visa</h2>
          </div>
        </div>
        <div className="mt-4  flex flx-col justify-center items-center">
          <p className="font-bold font-body text-xl mb-2">Amount</p>
          <div>
            <input type="number" className="input input-bordered" />
          </div>
          <button className="btn btn-accent mt-4">Pay</button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
