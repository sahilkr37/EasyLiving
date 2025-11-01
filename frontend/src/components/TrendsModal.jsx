import React from "react";
import SimpleModal from "./SimpleModal";
import MoodTrends from "./charts/MoodTrendChart";
import ExpenseTrends from "./charts/ExpenseTrendChart";
import ActivityTrendChart from "./charts/ActivityTrendChart";

export default function TrendsModal({ open, onClose, type }) {
    let title = "";
    let content = null;

    if (type === "mood") {
        title = "Mood Trends";
        content = <MoodTrends />;
    } else if (type === "expense") {
        title = "Expense Trends";
        content = <ExpenseTrends />;
    } else if (type === "activity") {
        title = "Activity Trends";
        content = <ActivityTrendChart />;
    }

    return (
        <SimpleModal open={open} onClose={onClose} title={title}>
            {content}
        </SimpleModal>
    );
}
