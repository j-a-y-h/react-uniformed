import React from "react";
import { useForm, useSettersAsEventHandler, useConstraints } from "../src";

export default function Form() {
    const validators = useConstraints({
        email: { required: true, type: "email" },
    });
    const { setValue, validateByName, values, errors, submit } = useForm({
        validators,
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
