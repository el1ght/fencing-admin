import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState([]);
    useEffect(() => {
        axios.get('/api/subscriptions').then(response => {
            setSubscriptions(response.data);
        });
    }, []);
    return (
        <Layout>
            <h1>Subscriptions</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Recipient</th>
                        <th>Tournaments</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.length > 0 && subscriptions.map(subscription => (
                        <tr>
                            <td>{(new Date(subscription.createdAt)).toLocaleString()}</td>
                            <td>{subscription.email}</td>
                            <td>
                                {subscription.line_items.map(l => (
                                    <>
                                        {l.data?.tournament_data.name} <br />
                                    </>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}