import React, { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Program {
  id: string;
  name: string;
  status: 'BACKLOG' | 'EN COURS' | 'TO DO' | 'CADRAGE';
  polid?: string;
  nature?: string;
  startDate?: string;
  endDate?: string;
  squad?: string;
  features?: Program[];
}

const Index = () => {
  const [selectedSquad, setSelectedSquad] = useState<string>("");
  const [selectedPI, setSelectedPI] = useState<string>("");
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set());

  const programs: Program[] = [
    {
      id: "PRG-1",
      name: "CAP KHAWASS",
      status: "BACKLOG",
      features: []
    },
    {
      id: "PRG-2",
      name: "Carte Virtuelle",
      status: "EN COURS",
      polid: "POL-123",
      nature: "Enhancement",
      features: [
        {
          id: "TM-833",
          name: "Carte virtuelle",
          startDate: "3/10/2024",
          endDate: "7/31/2024",
          squad: "Squad Monétique",
          status: "CADRAGE"
        },
        {
          id: "DRSE-963",
          name: "[Monétique] Feature 1",
          startDate: "10/14/2024",
          endDate: "1/18/2025",
          squad: "Squad Monétique",
          status: "TO DO"
        }
      ]
    }
  ];

  const toggleProgram = (id: string) => {
    const newExpanded = new Set(expandedPrograms);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedPrograms(newExpanded);
  };

  const getStatusColor = (status: Program['status']) => {
    switch (status) {
      case 'BACKLOG':
        return 'bg-blue-500';
      case 'EN COURS':
        return 'bg-blue-500';
      case 'TO DO':
        return 'bg-purple-500';
      case 'CADRAGE':
        return 'bg-emerald-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Program Increment Planning</h1>
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Squad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monetique">Squad Monétique</SelectItem>
                <SelectItem value="digital">Squad Digital</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select PI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pi1">PI 2024.1</SelectItem>
                <SelectItem value="pi2">PI 2024.2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline">Collapse All</Button>
        </div>

        <div className="space-y-4">
          {programs.map((program) => (
            <Card key={program.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleProgram(program.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedPrograms.has(program.id) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                  
                  <span className="text-blue-600 font-mono">{program.id}</span>
                  <span className="font-semibold">{program.name}</span>
                  
                  {program.polid && (
                    <span className="text-blue-600">POLID: {program.polid}</span>
                  )}
                  {program.nature && (
                    <span className="text-purple-600">NATURE: {program.nature}</span>
                  )}
                </div>

                <Badge className={`${getStatusColor(program.status)}`}>
                  {program.status}
                </Badge>
              </div>

              {expandedPrograms.has(program.id) && program.features && (
                <div className="mt-4 ml-8 space-y-4">
                  {program.features.map((feature) => (
                    <Card key={feature.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-blue-600 font-mono">{feature.id}</span>
                          <span className="font-medium">{feature.name}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          {feature.startDate && feature.endDate && (
                            <span className="text-gray-600">
                              {feature.startDate} → {feature.endDate}
                            </span>
                          )}
                          {feature.squad && (
                            <span className="text-gray-600">{feature.squad}</span>
                          )}
                          <Badge className={`${getStatusColor(feature.status)}`}>
                            {feature.status}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;