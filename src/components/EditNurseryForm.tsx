import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Nursery, District, Sapling } from '../types';

interface PredefinedNurseries {
    [key: number]: string[];
}

const EditNurseryForm = ({ nursery, onSave, onCancel }: { nursery: Nursery, onSave: (nursery: Nursery) => void, onCancel: () => void }) => {
    const [editedNursery, setEditedNursery] = useState(nursery);
    const [districts, setDistricts] = useState<District[]>([]);
    const [saplings, setSaplings] = useState<Sapling[]>([]);
    const [predefinedNurseries, setPredefinedNurseries] = useState<PredefinedNurseries>({});
    const [selectedSaplings, setSelectedSaplings] = useState<{ [key: number]: number }>({});
    const [nurseryNameError, setNurseryNameError] = useState('');
    const [saplingError, setSaplingError] = useState('');

    useEffect(() => {
        fetch('/data/districts.json')
            .then(response => response.json())
            .then(data => setDistricts(data));

        fetch('/data/saplings.json')
            .then(response => response.json())
            .then(data => setSaplings(data));

        fetch('/data/predefinedNurseries.json')
            .then(response => response.json())
            .then(data => setPredefinedNurseries(data));
    }, []);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (name === 'nursery') {
            if (value.trim() === '') {
                setNurseryNameError('Please enter a nursery name');
            } else {
                setNurseryNameError('');
            }
        }
        setEditedNursery({ ...editedNursery, [name]: value });
    };

    const handleSaplingSelection = (saplingId: number) => {
        const updatedSelectedSaplings = { ...selectedSaplings };
        if (updatedSelectedSaplings[saplingId]) {
            delete updatedSelectedSaplings[saplingId];
        } else {
            updatedSelectedSaplings[saplingId] = 1;
        }
        setSelectedSaplings(updatedSelectedSaplings);
        if (Object.keys(updatedSelectedSaplings).length > 0) {
            setSaplingError('');
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (nurseryNameError) {
            console.error(nurseryNameError);
        }
        else if (editedNursery.nursery.trim() === '' && Object.keys(selectedSaplings).length === 0) {
            setNurseryNameError('Please enter a nursery name');
            setSaplingError('Please select at least one sapling');
            return;
        } else if (editedNursery.nursery.trim() === '') {
            setNurseryNameError('Please enter a nursery name');
            return;
        } else if (Object.keys(selectedSaplings).length === 0) {
            setSaplingError('Please select at least one sapling');
            return;
        } else {
            const nurseryData = {
                nursery: editedNursery.nursery,
                district_id: editedNursery.district_id,
                nursery_saplings: Object.keys(selectedSaplings).map((saplingId) => ({
                    sapling_id: parseInt(saplingId),
                    quantity: selectedSaplings[parseInt(saplingId)],
                })),
            };
            onSave(nurseryData);
        }

    };

    return (
        <div className="fixed inset-20 bg-gray-600 bg-opacity-50 flex shadow-lg bg-gradient-to-b from-yellow-400 to-cyan-500">
            <div className="w-full bg-white p-6 rounded-lg shadow-2xl overflow-y-auto bg-gradient-to-b from-yellow-400 to-cyan-500">
                <form
                    onSubmit={handleSubmit}
                    className='form border-black'
                >
                    <div className="form-content w-fit">

                        <div>
                            <label><strong>District: </strong></label>
                            <select
                                className="mt-1 p-2 w-full border rounded-lg"
                                name="district_id"
                                value={editedNursery.district_id}
                                onChange={handleInputChange}
                            >
                                {districts.map((district) => (
                                    <option key={district.district_id} value={district.district_id}>
                                        {district.district}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>
                                <strong>Nursery Name: </strong>
                            </label>
                            <input type="text"
                                name="nursery"
                                value={editedNursery.nursery}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border rounded-lg border-gray-300"

                            />
                            {nurseryNameError && <p style={{ color: 'red' }}>{nurseryNameError}</p>}
                            <div className="mt-2 flex flex-wrap gap-2">
                                {predefinedNurseries[editedNursery.district_id as keyof typeof predefinedNurseries]?.map((nursery) => (
                                    <button
                                        key={nursery}
                                        type="button"
                                        className="bg-blue-200 text-blue-800 p-2 hover:bg-blue-300 rounded-full"
                                        onClick={() => {
                                            setEditedNursery({ ...editedNursery, nursery });
                                            setNurseryNameError('');
                                        }}
                                    >
                                        {nursery}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 className='mb-2'>
                                <strong>Sapling Data:</strong>
                            </h2>
                            <table className="w-full table-auto border-collapse border border-gray-300 shadow-lg">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 p-2 text-lg">Sapling ID & Name</th>
                                        <th className="border border-gray-300 p-2 text-lg text-gray-700">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {editedNursery.nursery_saplings.map((sapling, index) => (
                                        <tr key={index}>
                                            <td className="text-center border border-gray-300 p-2 text-lg">
                                                {sapling.sapling_id}- {saplings.find(s => s.sapling_id === sapling.sapling_id)?.sapling}
                                            </td>
                                            <td className="text-center border border-gray-300 p-2 text-lg text-gray-700">
                                                {sapling.quantity}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h2 className='mb-2' >
                                <strong>Edit The Saplings:</strong>
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {saplings.map((sapling) => (
                                    <button
                                        key={sapling.sapling_id}
                                        type="button"
                                        className={`p-2 rounded-full ${selectedSaplings[sapling.sapling_id] ? 'bg-green-200' : 'bg-gray-200'} text-gray-800 hover:bg-gray-300`}
                                        onClick={() => handleSaplingSelection(sapling.sapling_id)}
                                    >
                                        {sapling.sapling_id} - {sapling.sapling}
                                    </button>
                                ))}
                            </div>
                            {saplingError && <p style={{ color: 'red' }}>{saplingError}</p>}
                            {Object.keys(selectedSaplings).length > 0 && (
                                <div className="max-lg mx-auto mt-6 p-4 bg-white rounded-lg shadow-lg mb-6">
                                    <table className="w-full table-auto border-collapse border border-gray-300 shadow-lg">
                                        <thead>
                                            <tr>
                                                <th className="border border-gray-300 p-2 text-lg">Saplings</th>
                                                <th className="border border-gray-300 p-2 text-lg">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(selectedSaplings).map((saplingId) => (
                                                <tr key={saplingId} className="border border-gray-300">
                                                    <td className="text-center border border-gray-300 p-2 text-lg text-gray-700">
                                                        {saplings.find(s => s.sapling_id === parseInt(saplingId))?.sapling}
                                                    </td>
                                                    <td className="text-center border border-gray-300 p-2 text-lg">
                                                        <input
                                                            type="number"
                                                            placeholder='Enter quantity'
                                                            min="1"
                                                            value={selectedSaplings[parseInt(saplingId)]}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                const numericValue = parseInt(value);
                                                                if (isNaN(numericValue) || numericValue <= 0) {
                                                                    alert('Please enter a valid quantity greater than 0');
                                                                } else {
                                                                    setSelectedSaplings(prev => ({ ...prev, [parseInt(saplingId)]: numericValue }));
                                                                }
                                                            }}
                                                            className="p-1 border border-gray-300 rounded w-20 text-center"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button type="button" className="rounded-full uppercase text-xs cursor-pointer text-white font-bold py-2 px-3 bg-gradient-to-r from-red-700 to-pink-500" onClick={onCancel}>
                                Cancel
                            </button>
                            <button type="submit" className="rounded-full uppercase text-xs cursor-pointer text-white font-bold py-2 px-3 bg-gradient-to-r from-green-700 to-cyan-500">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        // </form>
        //         </div>
        //     </div>
    );
};

export default EditNurseryForm;

