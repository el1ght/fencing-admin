import Layout from "@/components/Layout"
import { useRouter } from "next/router"
import { useState, useEffect } from "react";
import axios from "axios";

export default function DeleteTournamentPage() {
    const router = useRouter();
    const [tournamentInfo, setTournamentInfo] = useState();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/tournaments?id='+id).then(response => {
            setTournamentInfo(response.data);
        });
    }, [id]);
    function goBack() {
        router.push('/tournaments');
    }
    async function deleteTournament() {
        await axios.delete('/api/tournaments?id='+id)
        goBack();
    }
    return (
        <Layout>
            <h1 className="text-center">Do you really want to delete "{tournamentInfo?.title}"?</h1>
            <div className="flex gap-2 justify-center">
                <button 
                    onClick={deleteTournament}
                    className="btn-red">
                    Yes
                </button>
                <button 
                    className="btn-default" 
                    onClick={goBack}>
                    No
                </button>
            </div>
        </Layout>
    )
};
