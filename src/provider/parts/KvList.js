import { ListEntry } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel'
import { jsx, jsxs } from '@bpmn-io/properties-panel/preact/jsx-runtime';

export default function(element, id, tabName) {
    return{
        id: id,
        component: jsx(Extention, {id: id, element: element, tabName}),
    };
}

function Extention(props) {
    const { element, id, tabName } = props;

    const moddle = useService('moddle');
    const modeling = useService('modeling');
    const debounce = useService('debounceInput');
    const businessObj = element.businessObject

    const getItems = () => {
        // return getOtherProps().keyValues || []
        //----------------
        return businessObj.keyValues || []
    }

    function updateItems(args){
        // let otherProps = getOtherProps();
        // otherProps.keyValues = args;
        // const extensionElements = businessObj.extensionElements || moddle.create('bpmn:ExtensionElements');
        // extensionElements.get('values')[0] = otherProps
        // return modeling.updateProperties(element, {
        //     extensionElements
        // });
        //----------------
        return modeling.updateProperties(element, {
            keyValues:args
        });
    }

    // const getOtherProps = () => {
    //     console.log(businessObj.extensionElements)
    //     const extensionElements = businessObj.extensionElements || moddle.create('bpmn:ExtensionElements');
    //     console.log(extensionElements)
    //     const values = extensionElements.get('values')
    //     let otherProps;
    //     if(!values.length){
    //         otherProps = moddle.create('magic:OtherProps');
    //         extensionElements.get('values').push(otherProps)
    //     } else {
    //         otherProps = values[0];
    //     }
    //     return otherProps;
    // }

    const onRemove = item => {
        let items = getItems()
        items = items.filter(itm => itm.index !== item.index)
        return updateItems(items)
    }

    const onAdd = () => {
        let items = getItems()
        items.push(genItem('', ''))
        return updateItems(items)
    }

    const onChange = (item) => {
        let items = getItems()
        items = items.map(itm => itm.index === item.index?item:itm)
        return updateItems(items)
    }

    function genItem(key, value) {
        let entry = moddle.create('magic:KeyValue')
        entry.key = key
        entry.value = value
        return entry
    }

    function renderItem(item, index){
        item.index = index
        return jsxs('div', {
            'class':'my-input-div',
            children:[
                genInputEntry(item, 'key'),
                genInputEntry(item, 'value'),
            ]
        })
    }

    const genInputEntry = (item, placeholder) =>{
        return jsx('input', {
            'class':'my-input',
            'onChange':(event)=>{ item[placeholder] = event.target.value; onChange(item) },
            type:'text',
            placeholder:placeholder,
            value: item[placeholder] })
    }

    return jsx(ListEntry,
        {
            'id':id,
            'element': element,
            'label': tabName,
            open:true,
            'items' : getItems(),
            'renderItem':renderItem,
            onAdd:onAdd,
            onRemove:onRemove,
            //
            'debounce': debounce
        }
    )
}
