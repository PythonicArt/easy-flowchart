import commandSelect from "./parts/CommandSelect";
import kvList from "./parts/KvList";
import { is } from 'bpmn-js/lib/util/ModelUtil';

class CommandProvider {
    constructor(propertiesPanel) {
        propertiesPanel.registerProvider(500, this);
    }

    getGroups(element) {
        if(is(element, "bpmn:Task")){
            return this.getCommandGroup(element)
        }
        return this.defaultGroup(element)
    }

    defaultGroup(element){
        return (groups) =>{
            groups = groups.map(group =>{
                    if(group.id === 'general'){
                        let l = [
                            kvList(element, 'costomArgs', 'CostomArgs' )
                        ]
                        group.entries = group.entries.concat(l)
                    }
                    return group
                }
            )
            return groups
        }
    }

    getCommandGroup(element){
        return (groups) => {
            groups = groups.map(group =>{
                    if(group.id === 'general'){
                        let l = [
                            commandSelect(element),
                            kvList(element, 'costomArgs', 'CostomArgs' )
                        ]
                        group.entries = group.entries.concat(l)
                    }
                    return group
                }
            )
            return groups;
        };
    }
}

CommandProvider.$inject = [ 'propertiesPanel', 'translate' ];

let index$2 = {
    __init__: ['commandProvider'],
    commandProvider: ['type', CommandProvider]
};

export {index$2 as CommandProvider};
