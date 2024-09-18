import { useAuth } from "../../contexts/AuthContext"

const Navbar = () => {
  const {auth}=useAuth()
  return (
    <div className='w-full p-4 flex justify-end  shadow-lg rounded-sm'>
      <div className='flex justify-center items-center gap-2'>
        <h1 className='text-lg capitalize'>{auth?.payload.username}</h1>
        <img src='/images/login/th.jpeg' className="rounded-full w-10 h-10" />
      </div>
    </div>
  )
}

export default Navbar