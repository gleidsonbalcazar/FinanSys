import { Shallow } from 'shallow-render';
import { DropdownMultiselectComponent } from './dropdown-multiselect.component';
import { DropdownMultiselectModule } from '../dropdown-multiselect/dropdown-multiselect.module';
import { dropdownMultiselect } from '../../mocks';

describe('DropdownMultiselectComponent', () => {
  let shallow: Shallow<DropdownMultiselectComponent>;

  beforeEach(() => {
    shallow = new Shallow(
      DropdownMultiselectComponent,
      DropdownMultiselectModule,
    );
  });

  const render = async () =>
    await shallow.render({
      bind: { statusList: dropdownMultiselect, showSelectedItens: true },
    });

  it('should create', () => {
    expect(shallow).toBeTruthy();
  });

  it('should contain the number of items on the list', async () => {
    const { find } = await render();
    const checkboxs = find('input[type=checkbox]');
    expect(checkboxs).toHaveFound(dropdownMultiselect.length);
  });

  it('should update the quantity of selected items', async () => {
    const { fixture, find } = await render();
    find('input[type=checkbox]')[0].nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const countBadge = find('.badge').nativeElement.innerText;
      expect(countBadge).toEqual('1');
    });
  });

  it('should emit selected items', async () => {
    const { fixture, find, outputs } = await render();
    find('input[type=checkbox]')[0].nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(outputs.statusChange.emit).toHaveBeenCalled();
    });
  });
});
