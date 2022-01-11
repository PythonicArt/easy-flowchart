<template>
  <v-app id="my-app">
    <v-app-bar
      app
      color="primary"
      dark
      absolute
      elevate-on-scroll
    >
      <v-app-bar-nav-icon />
      <v-app-bar-title>Flowchart Editor</v-app-bar-title>

      <v-btn
        text
        @click="openFile"
      >
        Open
      </v-btn>
      <div class="my-file-input">
        <v-file-input
          v-model="chosenFile"
          accept=".bpmn"
          placeholder="click me to pick an diagram"
          prepend-icon="mdi-file-edit-outline"
          @change="setChosenFile"
        />
      </div>

      <v-btn
        text
        @click="newFile"
      >
        <v-icon>mdi-download</v-icon>
        New
      </v-btn>
      <a
        id="js-download-diagram"
        class="btn-save"
        title="download BPMN diagram"
        href
        @click="saveFile"
      >
        <v-btn text>
          <v-icon>mdi-download</v-icon>
          Save
        </v-btn>
      </a>
      <!--      <v-btn text><v-icon>mdi-download</v-icon>查看xml</v-btn>-->

      <v-spacer />
      <v-btn text>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <diagram
        :xml-str="xmlStr"
        :chosen-file="chosenFile"
        @setBpmnJS="setBpmnJS"
        @setChosenFile="setChosenFile"
        @createDiagram="newFile"
      />
    </v-main>
  </v-app>
</template>

<script>
import Diagram from './components/Diagram';
import $ from 'jquery';
import {exampleStr} from './example/ExampleStr'
import {debounce} from 'min-dash';

export default {
  name: 'App',

  components: {
    Diagram,
  },
  data: () => ({
    bpmnJS: null,
    chosenFile: null,
    xmlStr: null,
    reader: new FileReader()
  }),
  mounted() {
  },
  methods: {
    setChosenFile(newFile, data) {
      if (data) {
        this.chosenFile = newFile
        this.xmlStr = data
        this.setEncoded($('#js-download-diagram'), this.xmlStr)
        return
      }
      if (newFile) {
        this.openFile2(newFile)
      }
    },
    setBpmnJS(BpmnJS) {
      this.bpmnJS = BpmnJS
      this.bpmnJS.on('commandStack.changed', this.exportFile)
    },
    newFile() {
      this.xmlStr = exampleStr;
      this.chosenFile = null;
    },
    saveFile() {
    },
    openFile() {
      if (!this.chosenFile) {
        alert('please select a file at first!!')
        return
      }
      this.openFile2(this.chosenFile)
    },
    openFile2(file) {
      // Use the javascript reader object to load the contents
      // of the file in the v-model prop
      this.reader.readAsText(file);
      this.reader.onload = () => {
        this.setChosenFile(file, this.reader.result);
      }
    },
    nameToSave() {
      return this.chosenFile ? this.chosenFile.name : 'diagram.bpmn'
    },
    exportFile: debounce(async function () {
      var downloadLink = $('#js-download-diagram')
      try {
        const {xml} = await this.bpmnJS.saveXML({format: true});
        this.setEncoded(downloadLink, xml);
      } catch (err) {
        // console.error('Error happened saving diagram: ', err);
        this.setEncoded(downloadLink, null);
      }
    }, 500),
    setEncoded(link, data) {
      var encodedData = encodeURIComponent(data);
      if (data) {
        link.addClass('active').attr({
          'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
          'download': this.nameToSave()
        });
      } else {
        link.removeClass('active');
      }
    },
  }// method
};
</script>

<style lang="less">
@import './styles/app.less';
</style>

