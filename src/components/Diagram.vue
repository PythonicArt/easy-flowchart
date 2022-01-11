<template>
  <div
    id="js-drop-zone"
    class="content"
  >
    <div class="message intro">
      <div class="note">
        Pick diagram at top or Drop BPMN diagram or <a
          id="create-diagram"
          href
          @click="createDaigram"
        >create a new diagram</a> to get started.
      </div>
    </div>
    <div class="message error">
      <div class="note">
        <p>Ooops, we could not display the BPMN 2.0 diagram.</p>
        <p>you can only drag file suffixed with .bpmn</p>
        <div class="details">
          <span>cause of the problem</span>
          <pre />
        </div>
      </div>
    </div>
    <div
      id="js-canvas"
      ref="canvas"
      class="canvas"
    />
    <div id="js-properties-panel" />
  </div>
</template>

<script>
import BpmnJS from 'bpmn-js/lib/Modeler';
import {BpmnPropertiesPanelModule, BpmnPropertiesProviderModule} from 'bpmn-js-properties-panel';
import $ from 'jquery';
import CommandDescriptor from '../descriptors/magic';
import { CommandProvider } from '../provider/CommandProvider';

export default {
  name: "Diagram",
  props:{
    xmlStr:{
      type:String,
      default:''
    }
 },
  data: function() {
    return {
      bpmnJS:null,
      container:null,
      canvas:null
    }
  },
  watch:{
    xmlStr: function (newStr){
      this.render(newStr)
    }
  },
  mounted() {
    this.container = $('#js-drop-zone')
    this.$nextTick(() => {
      this.initBpmn()
    })
    $('#create-diagram').click(function(e) {
      e.stopPropagation();
      e.preventDefault();
    });
    this.registerFileDrop(this.container, this)
  },
  methods:{
    createDaigram(){
      this.$emit('createDiagram')
    },
    initBpmn(){
      this.bpmnJS = new BpmnJS({
        additionalModules: [
          BpmnPropertiesPanelModule,
          BpmnPropertiesProviderModule,
          CommandProvider
        ],
        container: '#js-canvas',
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        moddleExtensions: {
          magic: CommandDescriptor
        }
      })
      this.$emit('setBpmnJS', this.bpmnJS)
    },
    genGraphyStr () {
      if(this.xmlStr)
        this.render(this.xmlStr)
    },
    async render(xmlStr){
      try {
        await this.bpmnJS.importXML(xmlStr);
        this.container.removeClass('with-error').addClass('with-diagram');
      } catch (err) {
        this.container.removeClass('with-diagram').addClass('with-error');
        this.container.find('.error pre').text(err.message);
        console.error(err);
      }
    },
    registerFileDrop(container, that){
      function handleFileSelect(e) {
        e.stopPropagation();
        e.preventDefault();
        //
        let reader = new FileReader();
        let file = e.dataTransfer.files[0]
        reader.onload = function(e) {
          let data = e.target.result;
          that.$emit('setChosenFile', file, data)
        };
        reader.readAsText(file);
      }
      function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
      }
      container.get(0).addEventListener('dragover', handleDragOver, false);
      container.get(0).addEventListener('drop', handleFileSelect, false);
    }// registerFileDrop
  }// method,
}
</script>

