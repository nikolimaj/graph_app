import React, { useState } from 'react'
import { useReactFlow } from "reactflow";
import { Card, ScrollArea, Group, Select, Divider } from "@mantine/core"
import { onNodesVisibilityChange } from './onNodesVisibilityChange';

import { TreeView } from '@mui/x-tree-view';
import { TreeItem } from '@mui/x-tree-view';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const theme = createTheme({
    components: {
      MuiTreeView: {
        styleOverrides: {
          root: {
            backgroundColor: 'white',
            height: '100%'
          },
        },
      },
    },
  });

// component for sidebar with filter area and list of nodes
export function SidebarFilterList() {
    // full height list:
    


    // get state of nodes from parent component
    const reactflow = useReactFlow()
    const nodes = reactflow.getNodes()

    // states for filter area
    const [genesShown, setGenesShown] = useState(true)
    const [diseasesShown, setDiseasesShown] = useState(true)
    const [drugsShown, setDrugsShown] = useState(true)

    const handleOptionChange = (e) => {

        const currentlyHandledType = e.target.id === "boxGenesFilter" ? "gene"
            : e.target.id === "boxDiseasesFilter" ? "disease"
                : e.target.id === "boxDrugsFilter" ? "drug"
                    : ""

        const nodeList = []

        nodes.forEach(node => {
            if (node.type === currentlyHandledType) {
                nodeList.push(node)
            }

        });

        if (e.target.id === "boxGenesFilter") {
            setGenesShown(!genesShown)
            onNodesVisibilityChange(reactflow, nodeList, genesShown)
        } else if (e.target.id === "boxDiseasesFilter") {
            setDiseasesShown(!diseasesShown)
            onNodesVisibilityChange(reactflow, nodeList, diseasesShown)
        } else {
            setDrugsShown(!drugsShown)
            onNodesVisibilityChange(reactflow, nodeList, drugsShown)
        }

    }

    const loadData = () => {

        const labels = nodes.map((node) => {
            return node.data?.label;
        })

        return (
            <Select
                id='searchbarNodes' 
                variant='filled' 
                size='xs' 
                radius='xl' 
                placeholder='search for node' 
                data={labels} 
                searchable 
            />
        )
    }

    const renderNodeTree = () => {

        const geneNodeLabels = nodes.map((node) => {
            if (node.data.type === 'gene') {
                console.log(node.data.displayProps.label)
                return node.data.displayProps.label
            }
        })

        const diseaseNodeLabels = nodes.map((node) => {
            if (node.data.type === 'disease') {
                return node.data.displayProps.label
            }
        })

        const drugNodeLabels = nodes.map((node) => {
            if (node.data.type === 'drug') {
                return node.data.displayProps.label
            }
        })

        return (
            <ThemeProvider theme={theme}>
                <TreeView aria-aria-label='node tree' defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
                    <TreeItem nodeId='listNodeGene' label='genes'>
                        {geneNodeLabels.map((label) => {
                            console.log(label)
                            return <TreeItem nodeId={label + "_treeItem"} label={label}/>
                        })}
                    </TreeItem>
                    <TreeItem nodeId='listNodeDisease' label='diseases'>
                        {diseaseNodeLabels.map((label) => {
                            return <TreeItem nodeId={label + "_treeItem"} label={label}/>
                        })}
                    </TreeItem>
                    <TreeItem nodeId='listNodeDrug' label='drugs'>
                        {drugNodeLabels.map((label) => {
                            return <TreeItem nodeId={label + "_treeItem"} label={label}/>
                        })}
                    </TreeItem>
                </TreeView>
            </ThemeProvider>
        )
    }

    return (
        <div style={{ height: '90vh', width: '23%', padding: '10px' }}>
            <Card withBorder shadow='sm' radius="lg" style={{ width: '100%', height: '100%' }}>
                <Group position="apart" style={{ padding: '6px 4px' }} >
                    <div>Nodes</div>
                    {loadData()}
                </Group>
                <Divider />
                <ScrollArea style={{ height: 'calc(100% - 60px)' }} offsetScrollbars scrollbarSize={2}>
                    {renderNodeTree()}
                </ScrollArea>
            </Card>
        </div>
    );
}