import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import TournamentForm from "@/components/TournamentForm";

export default function EditTournamentPage() {
    const [tournamentInfo, setTournamentInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/tournaments?id='+id).then(response => {
            setTournamentInfo(response.data);
        });
    }, [id])
    return (
        <Layout>
            <h1 className="font-medium mb-4 text-red-900">Edit Tournament</h1>
            {tournamentInfo && (
                <TournamentForm {...tournamentInfo} />
            )} 
        </Layout>
    )
};
