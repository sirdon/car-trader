import { Grid, Paper, makeStyles, InputLabel, MenuItem, FormControl, Select, SelectProps, Button } from "@material-ui/core";
import { Field, Form, Formik, useField, useFormikContext } from "formik";
import { GetServerSideProps } from "next";
import { getMakes, Make } from "../database/getMakes";
import React from 'react';
import router, { useRouter } from "next/router";
import { getModels, Model } from "../database/getModels";
import { getAsString } from "../getAsString";
import useSWR from "swr";
import Search from ".";
import { CarModel } from "../../api/Car";
import { getPaginatedCars } from "../database/getPaginatedCars";

export interface CarsListProps {
    makes: Make[];
    models : Model[];
    cars: CarModel[];
    totalPages:number;
}

export default function CarsList({makes, models, cars, totalPages}){
    return <Grid container spacing={3}>
        <Grid item xs={12} sm={5} md={3} lg={2}>
            <Search singleColumn makes={makes} models={models}></Search>
        </Grid>
        <Grid item xs={12} sm={7} md={9} lg={10}>
            <pre>{JSON.stringify({cars, totalPages}, null, 4)}</pre>
        </Grid>
    </Grid>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const make = getAsString(ctx.query.make);
    const [makes, models, pagination] = await Promise.all([
      getMakes(), getModels(make), getPaginatedCars(ctx.query)
    ])
    return { props: { makes, models, cars: pagination.cars, totalPages : pagination.totalPages } };
  }