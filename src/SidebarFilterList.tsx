import React, { useState } from 'react'
import { useReactFlow } from "reactflow";
import { List, Card, Text, ScrollArea, ThemeIcon, Checkbox, Group, Select, Divider } from "@mantine/core"
import { onNodesVisibilityChange } from './onNodesVisibilityChange';

import { TreeView } from '@mui/x-tree-view';
import { TreeItem } from '@mui/x-tree-view';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import shownIcon from './images/eye.png'
import hiddenIcon from './images/eye-closed.png'

const theme = createTheme({
    components: {
      MuiTreeView: {
        styleOverrides: {
          root: {
            backgroundColor: 'white',
          },
        },
      },
    },
  });

// component for sidebar with filter area and list of nodes
export function SidebarFilterList() {

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
            if (node.type === 'gene') {
                return node.data.label
            }
        })

        const diseaseNodeLabels = nodes.map((node) => {
            if (node.type === 'disease') {
                return node.data.label
            }
        })

        const drugNodeLabels = nodes.map((node) => {
            if (node.type === 'drug') {
                return node.data.label
            }
        })

        return (
            <ThemeProvider theme={theme}>
                <TreeView aria-aria-label='node tree' defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
                    <TreeItem nodeId='listNodeGene' label='genes'>
                        {geneNodeLabels.map((label) => {
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
        <div style={{ height: '90%', width: '23%', padding: '10px' }}>
            <Card withBorder shadow='sm' radius="lg" style={{ width: '100%', height: '100%' }}>
                <Group position="apart" style={{ padding: '6px 4px' }} >
                    <div>Nodes</div>
                    {loadData()}
                </Group>
                <Divider />
                <ScrollArea h={250} offsetScrollbars scrollbarSize={2} >
                    {renderNodeTree()}
                </ScrollArea>
            </Card>
        </div>
    );

    /* return (
        <div style={{ height: '100%', width: '20%' }}>
            <Card withBorder shadow='sm' radius="lg" style={{ width: '100%', height: '100%' }}>
                <Card.Section withBorder inheritPadding py="xs">
                    <Card withBorder shadow='sm' radius="lg" style={{ width: '100%', height: '50%' }}>
                        <Text weight={700} size="xl" mt="md" style={{ textAlign: 'center' }}>Filter</Text>
                        <Checkbox id="boxGenesFilter" label="Show Genes" color="green" style={{ padding: "3px" }} checked={genesShown} onChange={(e) => handleOptionChange(e)} />
                        <Checkbox id="boxDiseasesFilter" label="Show Diseases" color="orange" style={{ padding: "3px" }} checked={diseasesShown} onChange={(e) => handleOptionChange(e)} />
                        <Checkbox id="boxDrugsFilter" label="Show Drugs" color="red" style={{ padding: "3px" }} checked={drugsShown} onChange={(e) => handleOptionChange(e)} />
                    </Card>
                </Card.Section>
                <Card.Section withBorder inheritPadding py="xs">
                    <Card withBorder shadow='sm' radius="lg" style={{ width: '100%', height: '50%' }}>
                        <Text weight={700} size="xl" mt="md" style={{ textAlign: 'center' }}>Nodes</Text>
                        <ScrollArea h={250} type="scroll" offsetScrollbars scrollbarSize={4} style={{ border: '2px solid black', borderRadius: '10px', padding: '10px' }}>
                            <List>
                                {nodes.map((node) => (
                                    <List.Item
                                        id={node.id}
                                        icon={
                                            <ThemeIcon color='white' size="xs" radius="xl">
                                                <img
                                                    id={node.id + "_icon"}
                                                    style={{ width: '15px', height: '15px' }}
                                                    color='white'
                                                    src={shownIcon}
                                                    onClick={() => onNodesVisibilityChange(reactflow, [node], !node.hidden)}
                                                />
                                            </ThemeIcon>
                                        }
                                    >
                                        {node.data?.label}
                                    </List.Item>
                                ))}
                            </List>
                        </ScrollArea>
                    </Card>
                </Card.Section>
            </Card>
        </div>
    ) */
}