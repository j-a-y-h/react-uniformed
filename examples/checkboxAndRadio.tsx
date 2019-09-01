import React from "react";
import { useForm, useSettersAsEventHandler, useConstraints } from "../src";

export default function Form() {
    const { setValue, validateByName, values, errors, submit } = useForm({
        onSubmit: data => alert(JSON.stringify(data)),
    });
    const handleChange = useSettersAsEventHandler(setValue, validateByName);
    return (
        <form onSubmit={submit}>
            <h3>Favorite Fruits</h3>
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
            <input type="text" value="tangerine" name="fruits" />
            <h3>Preferred Drink</h3>
            <div>
                <label>
                    Juice
                    <input
                        type="radio"
                        value="juice"
                        name="drink"
                        checked={values.juice}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Water
                    <input
                        type="radio"
                        value="water"
                        name="drink"
                        checked={values.water}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Soda
                    <input
                        type="radio"
                        value="soda"
                        name="drink"
                        checked={values.soda}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <input type="submit" />
        </form>
    );
}
