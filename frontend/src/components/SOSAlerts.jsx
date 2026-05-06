import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";

export default function SOSAlerts() {

    const [alerts, setAlerts] = useState([]);

    const fetchAlerts = async () => {

        try {

            const res = await API.get("/api/sos/active");

            // 🚨 new SOS detected
            console.log("OLD ALERTS:", alerts.length);
            console.log("NEW ALERTS:", res.data.length);
            if (res.data.length > alerts.length) {

                console.log("🚨 CONDITION TRUE");

                const audio = new Audio("/emergency.mp3");

                audio.play()
                    .then(() => console.log("🚨 SOUND PLAYED"))
                    .catch(err => console.log(err));
            }

            setAlerts(res.data);

        } catch (err) {

            console.error(err);
        }
    };

    useEffect(() => {

        fetchAlerts();

        // 🔥 auto refresh every 5 sec
        const interval = setInterval(fetchAlerts, 5000);
        // audioRef.current = new Audio("./emergency.mp3");

        return () => clearInterval(interval);

    }, []);
    const resolveSOS = async (sosId) => {

        try {

            await API.put(`/api/sos/resolve/${sosId}`);

            // 🔥 remove immediately from UI
            setAlerts(prev =>
                prev.filter(alert => alert._id !== sosId)
            );

        } catch (err) {

            console.error(err);

            alert("Failed to resolve SOS");
        }
    };

    return (
        <div className="space-y-4 mb-6">

            {alerts.map((alert) => (

                <div
                    key={alert._id}
                    className="bg-red-100 border border-red-400 rounded-2xl p-5 shadow-lg"
                >

                    <h2 className="text-xl font-bold text-red-700 mb-2">
                        🚨 Emergency SOS
                    </h2>

                    <p className="text-gray-800">
                        <strong>{alert.elderName}</strong>
                        {" "}triggered emergency SOS
                    </p>

                    <p className="text-sm text-gray-600 mt-2">
                        Latitude: {alert.latitude}
                    </p>

                    <p className="text-sm text-gray-600">
                        Longitude: {alert.longitude}
                    </p>

                    <a
                        href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                        📍 Open in Maps
                    </a>
                    <button
                        onClick={() => resolveSOS(alert._id)}
                        className="ml-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                        ✅ Resolve SOS
                    </button>

                </div>
            ))}
        </div>
    );
}