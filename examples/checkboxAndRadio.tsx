import React from "react";
import { useForm, useSettersAsEventHandler } from "../src";

export default function Form() {
    const { setValue, values, submit } = useForm({
        onSubmit: data => alert(JSON.stringify(data)),
    });
    const handleChange = useSettersAsEventHandler(setValue);
    return (
        <form>
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
            </div>
            <h3>Preferred Drink</h3>
            <div>
                <label>
                    Juice
                    <input
                        type="radio"
                        value="juice"
                        name="drink"
                        checked={values.drink === "juice"}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Water
                    <input
                        type="radio"
                        value="water"
                        name="drink"
                        checked={values.drink === "water"}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <input type="submit" />
        </form>
    );
}
