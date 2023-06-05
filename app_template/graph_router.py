import logging
from pathlib import Path

import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel

_log = logging.getLogger(__name__)
graph_router = APIRouter(tags=["Graph"])

graph_data = pd.read_csv(Path(__file__).parent / "data/STRINGv11_OTAR281119_FILTER_combined.csv.gz", compression="gzip")
disease_data = pd.read_csv(Path(__file__).parent / "data/gwas_gene-diseases.csv.gz", compression="gzip")



@graph_router.get("/autocomplete")
def autocomplete(search: str, limit: int | None = 10) -> list[str]:
    return [s for s in graph_data["ENSG_A"].unique().tolist() if search.lower() in s.lower()][:limit]


class GraphResponse(BaseModel):
    ENSG_A: str
    ENSG_B: str
    combined_score: float

class GeneResponse(BaseModel):
    gene: str
    padj: float
    disease: str


@graph_router.get("/graph")
def graph(gene: str | None = None, limit: int = 1000) -> list[GraphResponse]:
    df = graph_data
    if gene:
        df = graph_data[graph_data["ENSG_A"] == gene]
    return df.head(limit).to_dict(orient="records")  # type: ignore


@graph_router.get("/disease2genes")
def disease2genes(disease: str | None = None, limit: int = 1000) -> list[GeneResponse]:
    df = disease_data
    if disease:
        df = disease_data[disease_data["disease"] == disease]
    df = df[disease_data["disease"].str.startswith("CHEBI_") == False]
    return df.head(limit).to_dict(orient="records")  # type: ignore


@graph_router.get("/drug2genes")
def drug2genes(drug: str | None = None, limit: int = 1000) -> list[GeneResponse]:
    df = disease_data
    if drug:
        df = disease_data[disease_data["disease"] == drug]
    df = df[disease_data["disease"].str.startswith("CHEBI_")]
    return df.head(limit).to_dict(orient="records")  # type: ignore