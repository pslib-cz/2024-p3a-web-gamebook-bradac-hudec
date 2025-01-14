import StatisticsTableCSS from './StatisticsTable.module.css';



const StatisticsTable = () => { 

   return (
    <div className={StatisticsTableCSS.statisticsTable__content}>
    <h1 className={StatisticsTableCSS.statisticsTable__content__heading}>
      Statistiky
    </h1>
    <div className={StatisticsTableCSS.statisticsTable__content__item}>
      <h2 className={StatisticsTableCSS.statisticsTable__content__heading}>
        asinejakydalsistat
      </h2>
      <p className={StatisticsTableCSS.statisticsTable__content__text}>0</p>
    </div>
    <div className={StatisticsTableCSS.statisticsTable__content__item}>
      <h2 className={StatisticsTableCSS.statisticsTable__content__heading}>
        Celkový počet dohraných her
      </h2>
      <p className={StatisticsTableCSS.statisticsTable__content__text}>0</p>
    </div>
    <div className={StatisticsTableCSS.statisticsTable__content__item}>
      <h2 className={StatisticsTableCSS.statisticsTable__content__heading}>
        Celkový počet chycených pokémonů
      </h2>
      <p className={StatisticsTableCSS.statisticsTable__content__text}>0</p>
    </div>
  </div>

   );

};
export default StatisticsTable;

