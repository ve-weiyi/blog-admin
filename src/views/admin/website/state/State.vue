<template>
  <div class="app-container">
    <el-row :gutter="15" class="system_state">
      <el-col :span="12">
        <el-card v-if="state.os" class="card_item">
          <template #header>
            <div>Runtime</div>
          </template>
          <div>
            <el-row :gutter="10">
              <el-col :span="12">os:</el-col>
              <el-col :span="12">{{ state.os.goos }}</el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">cpu nums:</el-col>
              <el-col :span="12">{{ state.os.numCpu }}</el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">compiler:</el-col>
              <el-col :span="12">{{ state.os.compiler }}</el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">go version:</el-col>
              <el-col :span="12">{{ state.os.goVersion }}</el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">goroutine nums:</el-col>
              <el-col :span="12">{{ state.os.numGoroutine }}</el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card v-if="state.disk" class="card_item">
          <template #header>
            <div>Disk</div>
          </template>
          <div>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-row :gutter="10">
                  <el-col :span="12">total (MB)</el-col>
                  <el-col :span="12">{{ state.disk.totalMb }}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">used (MB)</el-col>
                  <el-col :span="12">{{ state.disk.usedMb }}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">total (GB)</el-col>
                  <el-col :span="12">{{ state.disk.totalGb }}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">used (GB)</el-col>
                  <el-col :span="12">{{ state.disk.usedGb }}</el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-progress
                  :color="colors"
                  :percentage="state.disk.usedPercent"
                  type="dashboard"
                />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="system_state">
      <el-col :span="12">
        <el-card
          v-if="state.cpu"
          :body-style="{ height: '180px', 'overflow-y': 'scroll' }"
          class="card_item"
        >
          <template #header>
            <div>CPU</div>
          </template>
          <div>
            <el-row :gutter="10">
              <el-col :span="12">physical number of cores:</el-col>
              <el-col :span="12">{{ state.cpu.cores }}</el-col>
            </el-row>
            <el-row v-for="(item, index) in state.cpu.cpus" :key="index" :gutter="10">
              <el-col :span="12">core {{ index }}:</el-col>
              <el-col :span="12">
                <el-progress :color="colors" :percentage="+item.toFixed(0)" type="line" />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card v-if="state.ram" class="card_item">
          <template #header>
            <div>Ram</div>
          </template>
          <div>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-row :gutter="10">
                  <el-col :span="12">total (MB)</el-col>
                  <el-col :span="12">{{ state.ram.totalMb }}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">used (MB)</el-col>
                  <el-col :span="12">{{ state.ram.usedMb }}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">total (GB)</el-col>
                  <el-col :span="12">{{ state.ram.totalMb / 1024 }}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">used (GB)</el-col>
                  <el-col :span="12">
                    {{ (state.ram.usedMb / 1024).toFixed(2) }}
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-progress :color="colors" :percentage="state.ram.usedPercent" type="dashboard" />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ConfigAPI, OverviewAPI } from "@/api";
import { onUnmounted, ref } from "vue";

const timer = ref<any>(null);
const state = ref<any>({});
const colors = ref<any>([
  { color: "#5cb87a", percentage: 20 },
  { color: "#e6a23c", percentage: 40 },
  { color: "#f56c6c", percentage: 80 },
]);

const reload = async () => {
  OverviewAPI.getSystemInfo().then((res) => {
    state.value = res.data;
  });
};

reload();
timer.value = setInterval(() => {
  reload();
}, 1000 * 10);

onUnmounted(() => {
  clearInterval(timer.value);
  timer.value = null;
});
</script>

<style>
.system_state {
  padding: 10px;
}

.card_item {
  height: 280px;
}
</style>
