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
    const handleChange = useSettersAsEventHandler(setValue);
    const handleBlur = useSettersAsEventHandler(validateByName);
    return (
        <form onSubmit={submit}>
        <div>
            <label>Email</label>
            <input
            type="text"
            name="email"
            value={values.email}
            onBlur={handleBlur}
            onChange={handleChange}
            />
            <p style={{ color: "red" }}>{errors.email}</p>
        </div>
        <input type="submit" />
        </form>
    );
}
