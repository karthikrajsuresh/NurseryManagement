import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Sapling {
    sapling_id: number;
    sapling: string;
}

interface District {
    district_id: number;
    district: string;
}

interface NurserySapling {
    sapling_id: number;
    quantity: number;
}

interface Nursery {
    nursery: string;
    district_id: number;
    nursery_saplings: NurserySapling[];
}

interface NurseryState {
    saplings: Sapling[];
    districts: District[];
    nurseries: Nursery[];
}

const initialState: NurseryState = {
    saplings: [],
    districts: [],
    nurseries: [],
};

const nurserySlice = createSlice({
    name: 'nursery',
    initialState,
    reducers: {
        setSaplings: (state, action: PayloadAction<Sapling[]>) => {
            state.saplings = action.payload;
        },
        setDistricts: (state, action: PayloadAction<District[]>) => {
            state.districts = action.payload;
        },
        addNursery: (state, action: PayloadAction<Nursery>) => {
            state.nurseries.push(action.payload);
        },
        editNursery: (state, action: PayloadAction<{ index: number; updateNursery: Nursery }>) => {
            // const index = state.nurseries.findIndex(n => n.nursery === action.payload.nursery);
            // if (index !== -1) {
            //     state.nurseries[index] = action.payload;
            // }

            const { index, updateNursery } = action.payload;
            state.nurseries[index] = updateNursery;
        },
    },
});

export const { setSaplings, setDistricts, addNursery, editNursery } = nurserySlice.actions;

export default nurserySlice.reducer;
