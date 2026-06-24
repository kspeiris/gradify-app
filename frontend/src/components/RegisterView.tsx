import {
    useState
} from "react";

import {
    registerUser
} from "../api/authApi";

export default function RegisterView() {

    const [form, setForm] =
        useState({

            firstName: "",
            lastName: "",
            email: "",
            password: ""

        });

    const submit = async () => {

        try {

            await registerUser(form);

            alert(
                "Registration successful"
            );

        } catch (error) {

            alert(
                "Registration failed"
            );
        }
    };

    return (

        <div>

            <input
                placeholder="First Name"
                onChange={(e)=>
                    setForm({
                        ...form,
                        firstName:e.target.value
                    })
                }
            />

            <input
                placeholder="Last Name"
            />

            <input
                placeholder="Email"
            />

            <input
                type="password"
                placeholder="Password"
            />

            <button
                onClick={submit}
            >
                Register
            </button>

        </div>
    );
}
