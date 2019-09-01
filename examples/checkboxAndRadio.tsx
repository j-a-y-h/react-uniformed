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
            <h2>Favorite Fruits</h2>
            <div>
                <label>
                    Apple
                    <input type="checkbox" value="apple" name="fruits" />
                </label>
                <label>
                    Peach
                    <input type="checkbox" value="peach" name="fruits" />
                </label>
                <label>
                    Oranges
                    <input type="checkbox" value="orange" name="fruits" />
                </label>
            </div>
            <h2>Preferred Drink</h2>
            <div>
                <label>
                    Juice
                    <input type="radio" value="juice" name="drink" />
                </label>
                <label>
                    Water
                    <input type="radio" value="water" name="drink" />
                </label>
                <label>
                    Soda
                    <input type="radio" value="soda" name="drink" />
                </label>
            </div>
            <input type="submit" />
        </form>
    );
}
