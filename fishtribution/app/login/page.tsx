import Button from "../../components/Button"
import Divider from "../../components/Divider"
import TextInput from "../../components/TextInput"
export default function LoginPage() {
    return <div className="p-4 font-sans">
        <h1 className="flex justify-center font-title text-3xl font-medium">
            Fishtribution
        </h1>
        <h2 className="flex justify-start font-title text-2xl font-medium underline">
            Sign In
        </h2>
        <h3 className="font-title text font-medium">
            Email
        </h3>
        <TextInput />
        <h3 className="font-title text font-medium">
            Password
        </h3>
        <TextInput />
        <Button />
        <div className="flex justify-center">
            <Divider label="or" className="font-title font-light" />
        </div>
        <Button />
        <p className="flex justify-center text-sm">
            Forgot password?
        </p>
        <p className="flex justify-center text-sm">
            <div className="flex">
                <p>Not a member yet?</p>
                <a href="/signup" className="pl-1 text-blue-500">Sign up</a>
            </div>
        </p>
    </div>
}