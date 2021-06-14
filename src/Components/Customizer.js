import React, { useState } from 'react';
import './Customizer.css';
import prodImg from '../Resources/macbook.jpeg';


export default function Customizer({data}) {
    //Constants
    const RATE = 13 / (100 * 12);
    const TIME = 12;

    //States
    const [prod, setProd] = useState(data);
    const [totalPrice, setTotalPrice] = useState(data.basePrice);

    //Functions
    /*
     * Function used to return list of specifications for product
    */
    const SpecList = () => {
        return prod.components.map(item => {
            return item.variants.map(v => {
                if(v.selected) {
                    return <li className="product-summary-item" key={v.id}>{v.variantName}</li>
                }
                return null;
            })
        });
    }

    /*
     * Function used to return list of components for product
    */
    const ComponentList = () => {
        return prod.components.map((item) => {
            if(item.variants.length > 1) {
                return (
                    <div className="product-component" key={item.id}>
                        <fieldset>
                            <legend className="product-component-title">{item.name}</legend>
                            <div>
                                <VariantList variants={item.variants} component={item.id}/>
                            </div>
                        </fieldset>
                    </div>
                )
            } else return null; 
        })
    }

    /*
     * Function used to return list of variants for component
    */
    const VariantList = ({variants, component}) => {
        return variants.map((item) => {
            return (
                <div key={item.id}>
                    <input type="radio" id={item.id} name={component} checked={item.selected} value={item.price} onChange={onVariantSelect} className="product-option-selector"/>
                    <label htmlFor={item.id} className="product-option-selector-content">
                        <div className="product-option-label-left">
                            {item.variantName}
                        </div>
                        <div className="product-option-label-right">
                            {item.price !== 0 ? `${item.price} ₹` : null} 
                        </div>
                    </label>
                </div>
            )
        })
    }

    /*
     * Function used to update total price of product based on selected customization
    */
    const onVariantSelect = (event) => {
        if(!event.target.name || !event.target.id || !event.target.value) return;
        const updatedProdComponents = prod.components.map((item) => {
            if(item.id === event.target.name) {
                item.variants.map(v => {
                    if(v.id === event.target.id) {
                        setTotalPrice(totalPrice + v.price);
                        v.selected = true;
                    } else {
                        v.selected = false;
                    }
                    v.price -= Number(event.target.value);
                    return v;
                })
            }
            return item;
        })
        setProd({...prod, updatedProdComponents});
    }

    /*
     * Function used to calculate EMI based on total price
    */
    const calculateEmi = (amount) => {
        const emi = (amount * RATE * Math.pow(RATE + 1, TIME)) / (Math.pow(RATE + 1, TIME) - 1);
        return thousandSeparators(Math.ceil(emi));
    }

    /*
     * Function used to add thousand separators commas in number
    */
    function thousandSeparators(num) {
        var num_parts = num.toString().split(".");
        num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return num_parts.join(".");
    }

    return (
        <>
            <div className="container">
                <div className="container-left">
                    <img src={prodImg} alt="macbookImage" className="container-left-image"/>   
                </div>
                <div className="container-right">
                    <div>
                        <div className="container-right-maintitle">Customize your<br/>{prod.name} -<br/>{prod.variant}</div>
                        <div className="product-summary-container">
                            <ul className="product-summary">
                                <SpecList/>   
                            </ul>
                        </div>
                        <div className="product-component-container">
                            <ComponentList/>
                        </div>
                    
                    </div>
                </div>
            </div>
            <div className="product-purchase-detail-container">
                <div className="product-purchase-maintitle">
                    From ₹{calculateEmi(totalPrice)}/mo. <br/>
                    with EMI,** or ₹{thousandSeparators(totalPrice)} 
                </div>
            </div>
        </>
    )
}