import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTemplateDataById } from "../../services/template-api-service";

export default function TemplateDetails() {
    const { templateId } = useParams();
    const [template, setTemplate] = useState({});

    const getTemplateById = async () => {
        try {
            const res = await getTemplateDataById(templateId);
            setTemplate(res);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getTemplateById(templateId);
    }, [templateId]);
    return <div>templateDetails</div>;
}
