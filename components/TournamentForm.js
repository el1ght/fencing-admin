import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./spinner";
import { ReactSortable } from "react-sortablejs";

export default function TournamentForm({
    _id,
    title:existingTitle, 
    description:existingDescription, 
    date:existingDate,
    images:existingImages,
    category: assignedCategory,
    properties:assignedProperties,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [tournamentProperties, setTournamentProperties] = useState(assignedProperties || {});
    const [date, setDate] = useState(existingDate || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToTournaments, setGoToTournaments] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, []);

    async function saveTournament(ev) {
        ev.preventDefault();
        const data = {title, description, date, images, category, properties:tournamentProperties};
        if (_id) {
            //update
            await axios.put('/api/tournaments', {...data,_id});
        } else {
            //create
            await axios.post('/api/tournaments', data);
        }
        setGoToTournaments(true);
    }
    if (goToTournaments) {
        router.push('/tournaments');
    }
    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    function setTournamentProp(propName, value) {
        setTournamentProperties(prev => {
            const newTournamentProps = {...prev};
            newTournamentProps[propName] = value;
            return newTournamentProps;
        });
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let CatInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...CatInfo.properties);
        while (CatInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === CatInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            CatInfo = parentCat;
        }
    }

    return (
            <form onSubmit={saveTournament}>
                <label>Tournament title *</label>
                <input 
                    type="text" 
                    placeholder="tournament title" 
                    value={title} 
                    onChange={ev => setTitle(ev.target.value)}
                />
                <label>Category *</label>
                <select 
                    value={category} 
                    onChange={ev => setCategory(ev.target.value)}
                >
                    <option value="">Uncategorized!</option>
                    {categories.length > 0 && categories.map(c => (
                        <option value={c._id}>{c.name}</option>
                    ))} 
                </select>
                {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                    <div className="">
                        <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                        <div>
                            <select 
                                value={tournamentProperties[p.name]} 
                                onChange={ev => setTournamentProp(p.name, ev.target.value)}
                            >
                                {p.values.map(v => (
                                    <option value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
                <label>Photos</label>
                <div className="mb-2 text-red-700 flex flex-wrap gap-2">
                    <ReactSortable 
                        list={images} 
                        setList={updateImagesOrder}
                        className="flex flex-wrap gap-2"
                    >
                        {!!images?.length && images.map(link => (
                            <div key={link} className="h-24 bg-orange-100 p-4 shadow-md rounded-sm border border-orange-300">
                                <img  src={link} alt="" className="rounded-md"/>
                            </div>
                        ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className="h-24 p-1 outline outline-2 rounded-lg flex items-center shadow-md">
                            <Spinner />
                        </div>
                    )}
                    <label className="w-24 h-24 cursor-pointer outline outline-2 outline-dashed outline-red-600 rounded-lg flex items-center justify-center shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <input type="file" onChange={uploadImages} className="hidden"></input>
                    </label>
                </div>
                <label>Description</label>
                <textarea 
                    placeholder="description" 
                    value={description} 
                    onChange={ev => setDescription(ev.target.value)}
                />
                <label>Start date *</label>
                <input 
                    type="text" 
                    placeholder="start date"
                    value={date}
                    onChange={ev => setDate(ev.target.value)}
                />
                <button 
                    type="submit" 
                    className="btn-primary">
                    Save
                </button>
            </form>
    );
};
