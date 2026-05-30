<script>
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import AdoptionTable from '$lib/components/dashboard/AdoptionTable.svelte';
  import AdoptionDetailModal from '$lib/components/dashboard/AdoptionDetailModal.svelte'; 
  import { getAdoptions } from '$lib/data/mockAdoptions.js';

  let adoptionData = $state(getAdoptions());
  let selectedAdoption = $state(null);

  
 function handleOpenModal(item) { selectedAdoption = item; }
  
 function handleCloseModal() { selectedAdoption = null; }

 function handleUpdateData(updatedItem) {
    
    adoptionData = adoptionData.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
 }
</script>

<svelte:head>
  <title>Adoption Dashboard | Cho's Lazey Studio</title>
</svelte:head>

<AdoptionDetailModal 
  adoption={selectedAdoption} 
  onClose={handleCloseModal} 
onUpdate={handleUpdateData}
/>

<div class="page-container">
  <PageHeader 
    eyebrow="ARTWORK ADOPTION" 
    title="Adopted Creation" 
    description="Keep track of your listed artworks that have found new patrons who cherish your vision. Monitor status and transactions seamlessly." 
  />
  
  <AdoptionTable 
    data={adoptionData} 
    onView={handleOpenModal} 
  />
</div>

<style>
  .page-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
</style>
