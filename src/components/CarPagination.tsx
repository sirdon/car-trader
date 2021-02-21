import { Grid, Paper, makeStyles, InputLabel, MenuItem, FormControl, Select, SelectProps, Button } from "@material-ui/core";
import { Field, Form, Formik, useField, useFormikContext } from "formik";
import { PaginationRenderItemParams, Pagination, PaginationItem} from '@material-ui/lab'
import { GetServerSideProps } from "next";
import { getMakes, Make } from "../database/getMakes";
import React, { forwardRef, useState } from 'react';
import { useRouter } from "next/router";
import { getModels, Model } from "../database/getModels";
import { getAsString } from "../getAsString";
import useSWR from "swr";
import Link from 'next/link'
import { CarModel } from "../../api/Car";
import { getPaginatedCars } from "../database/getPaginatedCars";
import { ParsedUrlQuery, stringify } from "querystring";
import deepEqual from 'fast-deep-equal';

export function CarPagination({totalPages}: { totalPages: number}){
    const {query} = useRouter();
    return  <Pagination
    page={parseInt(getAsString(query.page) || '1')}
    count={totalPages}
    renderItem={(item) => (
      <PaginationItem
        component={MaterialUiLink}
        query={query}
        item={item}
        {...item}
      />
    )}
  />
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
  
  