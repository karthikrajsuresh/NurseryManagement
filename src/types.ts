export interface Sapling {
    sapling_id: number;
    sapling: string;
}

export interface District {
    district_id: number;
    district: string;
}

export interface NurserySapling {
    nursery_sapling_id?: number;
    nursery_id?: number;
    sapling_id: number;
    quantity: number;
}

export interface Nursery {
    nursery_id?: number;
    nursery: string;
    district_id: number;
    nursery_saplings: NurserySapling[];
}
