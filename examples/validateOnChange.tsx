import React from "react";
import { useForm, useSettersAsEventHandler } from "../src";

export default function Form() {
    const { setValue, validateByName, values, errors, submit } = useForm({
        constraints: {
            email: { required: true, type: "email" },
        },
        onSubmit: data => alert(JSON.stringify(data)),
    });
    const handleChange = useSettersAsEventHandler(setValue, validateByName);
    return (
        <form onSubmit={submit}>
        <div>
            <label>Email</label>
            <input
                name="email"
                value={values.email}
                onChange={handleChange}
            />
            <p style={{ color: "red" }}>{errors.email}</p>
        </div>
        <input type="submit" />
        </form>
    );
}
