import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel'
import { jsx } from '@bpmn-io/properties-panel/preact/jsx-runtime';

export default function(element) {
    return{
        id: 'cmd',
        component: jsx(Cmd, {id:'cmd', element: element}),
        isEdited: isSelectEntryEdited
    };
}

function Cmd(props) {
    const { element, id } = props;

    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = (element) => {
        return element.businessObject.cmd || 'none';
    }

    const setValue = value => {
        return modeling.updateProperties(element, {
            cmd: value
        });
    }

    const getOptions = () =>{
        return [
            genOption('doMine'),
            genOption('doEventDialogue'),
            genOption('doTaskById'),
            genOption('doDebate'),
            genOption('none'),
        ]
    };

    function genOption(cmd){
        return { label: cmd, value: cmd }
    }

    return jsx(SelectEntry,
        {
            'element': element,
            'id':id,
            'label': translate('Command'),
            'description': translate('Select a command'),
            'getValue': getValue,
            'setValue': setValue,
            //
            'getOptions' : getOptions,
            'debounce': debounce
        }
    )

}
