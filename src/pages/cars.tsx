import { Grid, Paper, makeStyles, InputLabel, MenuItem, FormControl, Select, SelectProps, Button } from "@material-ui/core";
import { Field, Form, Formik, useField, useFormikContext } from "formik";
import { PaginationRenderItemParams, Pagination, PaginationItem} from '@material-ui/lab'
import { GetServerSideProps } from "next";
import { getMakes, Make } from "../database/getMakes";
import React, { forwardRef, useState } from 'react';
import router, { useRouter } from "next/router";
import { getModels, Model } from "../database/getModels";
import { getAsString } from "../getAsString";
import useSWR from "swr";
import Link from 'next/link'
import Search from ".";
import { CarModel } from "../../api/Car";
import { getPaginatedCars } from "../database/getPaginatedCars";
import { ParsedUrlQuery, stringify } from "querystring";
import deepEqual from 'fast-deep-equal';
import { CarPagination } from "../components/CarPagination";
import { CarCard } from "../components/CarCard";
export interface CarsListProps {
    makes: Make[];
    models : Model[];
    cars: CarModel[];
    totalPages:number;
}
export default function CarsList({
  makes,
  models,
  cars,
  totalPages,
}: CarsListProps) {
  const { query } = useRouter();
  const [serverQuery] = useState(query);
  const { data } = useSWR('/api/cars?' + stringify(query), {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery)
      ? { cars, totalPages }
      : undefined,
  });
  console.log("data",data)
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>
      <Grid container item xs={12} sm={7} md={9} lg={10} spacing={3}>
          <Grid item xs={12}>
        <CarPagination totalPages={data?.totalPages}></CarPagination>
        </Grid>
        {(data?.cars || []).map((car)=>(
            <Grid key={car.id} item xs={12} sm={6}>
            <CarCard key={car.id} car={car}/>
            </Grid>
        ))}
         <Grid item xs={12}>
        <CarPagination totalPages={data?.totalPages}></CarPagination>
        </Grid>
      </Grid>
    </Grid>
  );
}

export interface MaterialUiLinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}


const MaterialUiLink = forwardRef<HTMLAnchorElement,MaterialUiLinkProps>(({ item, query, ...props }, ref) => (
    <Link
    href={{
      pathname: '/cars',
      query: { ...query, page: item.page },
    }} shallow
  >
    <a ref={ref} {...props}></a>
  </Link>
  ));


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);

  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query),
  ]);

  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPages: pagination.totalPages,
    },
  };
};