import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import { IPackage } from '../interfaces/Interfaces';

type Props = {
    packages: IPackage["packageArray"] | undefined
}

export default function View(props: Props) {
    
    // dev effect, remove once done
    useEffect(() => {
        console.log(props.packages)
    }, [props.packages]);
    
    // render packages, extra check to make sure package is installed
    const packageItem = (p: IPackage["package"], index: number) => {
        if (p.foundAsPackage) {
            return (
                <div style={{marginTop: 10}} key={index}>
                    <Link to="/">
                        {p.name}
                    </Link>
                </div>
            )
        }
    }

    const PackageList = () => {
        if (props.packages?.length) {
            return (
                <div style={{marginBottom: 30}}>
                    <h5>Package index:</h5>
                    {props.packages.map((item, index)=> (
                        <div style={{marginTop: 10}}>{packageItem(item, index)}</div>
                    ))}
                </div>
            )
        } else {
            return (
                <div>
                    lista pitäisi valita
                </div>
            )
        }
    }

    return (
        <div style={{
            display: "flex", justifyContent: "center",
            alignItems: "center", marginTop: 20
        }}>
            <PackageList />
        </div>
    )
}