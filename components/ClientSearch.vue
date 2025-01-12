<script setup lang="ts">
import type {ICategoryInfo, ICategoryMenuTreeItem} from "~/types/TClient";
import CategoryItem from "~/components/CategoryItem.vue";


const emit = defineEmits(['searchComplete'])
const {data: searchData} = await useFetch('/api/client/search-data')
const router = useRouter()
const categoryTree = ref<ICategoryMenuTreeItem[]>()

function buildCategoryTree(
    categories: ICategoryInfo[],
    parentId: string | null = null
): ICategoryMenuTreeItem[] {
  return categories
      .filter(category => category.parentId === parentId)
      .map(category => ({
        ...{
          alias: category.alias,
          label: category.name,
          click: () => {
            navigateTo(`/search/ctg/${category.alias}`)
            emit('searchComplete')
          }
        },
        children: buildCategoryTree(categories, category.id),
      }));
}

onBeforeMount(() => {
  categoryTree.value = buildCategoryTree(searchData.value!.categories)
})

console.log(searchData.value)
const productsActions = computed(() => searchData.value?.products?.map(product => {
  return {
    id: product.alias,
    label: product.name,
    avatar: {
      src: joinPath('/images', product.images[0]?.location, product.images[0]?.name),
      loading: 'lazy'
    },
    click: () => {
      navigateTo(`/search/prd/${product.alias}`)
      emit('searchComplete')
    }
  }
}))

function onSelect(option: any) {
  if (option.click) {
    option.click()
  } else if (option.to) {
    router.push(option.to)
  } else if (option.href) {
    window.open(option.href, '_blank')
  }
}


</script>

<template>
  <div class="p-3">
    <UInput
        icon="heroicons:magnifying-glass-solid"
        :padded="false"
        placeholder="Tìm kiếm..."
        variant="none"
        class="w-full"
    />
    <UDivider class="py-2"/>
    <div class="flex gap-14 max-h-[70vh] overflow-hidden overflow-y-auto p-1">
      <CategoryItem v-for="item in categoryTree" :data="item"/>
    </div>
    <!--    <UCommandPalette ref="commandPaletteRef" :groups="groups" :autoselect="false" @update:model-value="onSelect"/>-->
  </div>
</template>

