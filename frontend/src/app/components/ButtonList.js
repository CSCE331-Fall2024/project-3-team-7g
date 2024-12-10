"use client";

import React, { useState, useEffect } from "react";
import OptionButton from "./OptionButton";
const dotenv = require("dotenv").config();
import changeText from "@/app/language";

const ButtonList = ({ listType, handleItemClick, selectedItems, isAccessible }) => {
    const [buttons, setButtons] = useState([]);
    const [translatedTexts, setTranslatedTexts] = useState({});

    useEffect(() => {
        const fetchButtons = async () => {
            try {
                const types = ["Side", "Entree", "Appetizer", "Drink", "Size"];
                let sets = [];
                for (let i = 0; i < types.length; i++) {
                    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_PORT + '/getItemsByType/' + types[i], {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Server responded with status ${response.status}`);
                    }

                    const data = await response.json();
                    sets.push(data);
                }

                const buttonSets = {
                    sides: sets[0],
                    entrees: sets[1],
                    appetizer: sets[2],
                    drink: sets[3],
                    sizes: sets[4],
                };

                setButtons(buttonSets[listType] || []);
            } catch (error) {
                console.error("Fetch error:", error.message);
            }
        };

        fetchButtons();
    }, [listType]);

    const translateText = async () => {
        try {
            const textsToTranslate = buttons.map((button) => button.OptionName);
    
            const response = await changeText(localStorage.getItem("userEmail"), textsToTranslate);
    
            const translations = textsToTranslate.reduce((acc, originalText, index) => {
                acc[originalText] = response[index];
                return acc;
            }, {});
    
            setTranslatedTexts(translations);
        } catch (error) {
            console.error("Translation error:", error.message);
        }
    };
    

    useEffect(() => {
        translateText();
    }, [buttons]);

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                padding: "16px",
            }}
        >
            {buttons.map((button, index) => {
                const translatedText = translatedTexts[button.OptionName] || button.OptionName;

                const isSelected = selectedItems ? selectedItems.includes(button.OptionName) : false;

                return (
                    <OptionButton
                        key={index}
                        OptionName={translatedText} // Use translated text
                        listType={listType}
                        image={button.image} // Preserve image
                        handleItemSelection={handleItemClick}
                        isSelected={isSelected}
                        isAccessible={isAccessible}
                    />
                );
            })}
        </div>
    );
};

export default ButtonList;
